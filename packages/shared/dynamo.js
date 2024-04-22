const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const mergedParams = (...params) =>
  params.reduce(
    (acc, param) =>
      Object.entries(param).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value)
          ? [...acc[key], ...value]
          : typeof value === 'object'
          ? { ...acc[key], ...value }
          : value;
        return acc;
      }, acc),
    {}
  );

const projectionExpression = (attributes) => {
  if (attributes === undefined) return {};
  const ProjectionExpression = attributes
    .map((attr) => `${attr.includes('.') ? '' : '#'}${attr}, `)
    .reduce((acc, str) => acc + str)
    .slice(0, -2);

  const attributesToExpression = attributes.filter(
    (attr) => !attr.includes('.')
  );
  const ExpressionAttributeNames = attributesToExpression.reduce(
    (acc, attr) => {
      acc['#' + attr] = attr;
      return acc;
    },
    {}
  );

  return attributesToExpression.length
    ? { ProjectionExpression, ExpressionAttributeNames }
    : { ProjectionExpression };
};

const getId = () => 'a' + uuidv4().split('-').join('');

const getModule = (config) => {
  const OFFLINE_OPTIONS = {
    region: 'localhost',
    endpoint: 'http://0.0.0.0:8000',
    accessKeyId: 'MockAccessKeyId',
    secretAccessKey: 'MockSecretAccessKey',
  };
  console.log(process.env.IS_OFFLINE);
  const documentClient = new AWS.DynamoDB.DocumentClient(
    process.env.IS_OFFLINE ? OFFLINE_OPTIONS : config
  );

  const paginationAware = (method) => async (params) => {
    const getItems = async (items, lastEvaluatedKey, firstTime = false) => {
      if (!lastEvaluatedKey) return items;

      const { Items, LastEvaluatedKey } = await documentClient[method](
        firstTime ? params : { ...params, ExclusiveStartKey: lastEvaluatedKey }
      ).promise();
      return await getItems([...items, ...Items], LastEvaluatedKey);
    };
    return getItems([], true, true);
  };

  const scan = paginationAware('scan');
  const query = paginationAware('query');

  const mergeInList = (params, listName, list) =>
    documentClient
      .update({
        ...params,
        UpdateExpression: `set #listName = list_append(#listName, :mergeList)`,
        ExpressionAttributeValues: {
          ':mergeList': list,
        },
        ExpressionAttributeNames: {
          '#listName': listName,
        },
      })
      .promise();

  return {
    scan,
    query,
    documentClient,
    projectionExpression,
    paginationAware,
    getAll: (TableName, params) =>
      scan({ TableName, ...projectionExpression(params) }),
    searchByPKFilterFrom: (key, value, filter, from) => ({
      KeyConditionExpression: '#a = :aa AND #b >= :bb',
      ExpressionAttributeNames: {
        '#a': key,
        '#b': filter,
      },
      ExpressionAttributeValues: {
        ':aa': value,
        ':bb': from,
      },
    }),
    searchByKeyFilterFrom: (filter, from) => ({
      FilterExpression: '#a >= :aa',
      ExpressionAttributeNames: {
        '#a': filter,
      },
      ExpressionAttributeValues: {
        ':aa': from,
      },
    }),
    searchByPKParams: (key, value) => ({
      KeyConditionExpression: '#a = :aa',
      ExpressionAttributeNames: {
        '#a': key,
      },
      ExpressionAttributeValues: {
        ':aa': value,
      },
    }),
    searchByKeyParams: (key, value) => ({
      FilterExpression: '#a = :aa',
      ExpressionAttributeNames: {
        '#a': key,
      },
      ExpressionAttributeValues: {
        ':aa': value,
      },
    }),
    mergedParams,
    getId,
    withId: (item) =>
      item.id
        ? item
        : {
            ...item,
            id: getId(),
          },
    setNewValue: (params, propName, value) =>
      documentClient
        .update({
          ...params,
          UpdateExpression: `set #value = :newValue`,
          ExpressionAttributeValues: {
            ':newValue': value,
          },
          ExpressionAttributeNames: {
            '#value': propName,
          },
        })
        .promise(),
    flatUpdateParams: (params) => ({
      UpdateExpression: `set ${Object.entries(params)
        .map(([key]) => `#${key} = :${key}, `)
        .reduce((acc, str) => acc + str)
        .slice(0, -2)}`,
      ExpressionAttributeNames: Object.keys(params).reduce(
        (acc, key) => ({
          ...acc,
          [`#${key}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: Object.entries(params).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [`:${key}`]: value,
        }),
        {}
      ),
    }),
    put: (params) => documentClient.put(params).promise(),
    getByPK: (params, attributes = undefined) =>
      documentClient
        .get(
          mergedParams(
            params,
            attributes ? projectionExpression(attributes) : {}
          )
        )
        .promise()
        .then((data) => (Object.keys(data).length ? data.Item : undefined)),
    mergeInList,
    putToList: (params, listName, object) =>
      mergeInList(params, listName, [object]),
    removeFromListByIndex: (params, listName, index) =>
      documentClient
        .update({
          ...params,
          UpdateExpression: `remove #listName[${index}]`,
          ExpressionAttributeNames: {
            '#listName': listName,
          },
        })
        .promise(),
    getWithoutFields: (fields) =>
      fields.reduce(
        (acc, field, index) =>
          `${index > 0 ? `${acc} and ` : ''}attribute_not_exists(${field})`,
        ''
      ),
  };
};

module.exports = {
  ...getModule({}),
  getModule,
};

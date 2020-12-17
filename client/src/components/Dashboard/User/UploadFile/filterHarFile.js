/* eslint-disable import/no-anonymous-default-export */
const filterHarFile = (jsonContents) => {
  const toCamelCase = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  const entries = jsonContents.log.entries.map((entry) => ({
    startedDateTime: entry.startedDateTime,
    timings: { wait: entry.timings.wait },
    serverIPAddress: entry.serverIPAddress,
    request: {
      method: entry.request.method,
      url: entry.request.url,
      headers: entry.request.headers
        .filter(
          (header) =>
            header.name.toLowerCase() === 'content-type' ||
            header.name.toLowerCase() === 'cache-control' ||
            header.name.toLowerCase() === 'pragma' ||
            header.name.toLowerCase() === 'expires' ||
            header.name.toLowerCase() === 'age' ||
            header.name.toLowerCase() === 'last-modified' ||
            header.name.toLowerCase() === 'host'
        )
        .reduce(
          (obj, item) => ((obj[toCamelCase(item.name)] = item.value), obj),
          {}
        ),
    },
    response: {
      status: entry.response.status,
      statusText: entry.response.statusText,
      headers: entry.response.headers
        .filter(
          (header) =>
            header.name.toLowerCase() === 'content-type' ||
            header.name.toLowerCase() === 'cache-control' ||
            header.name.toLowerCase() === 'pragma' ||
            header.name.toLowerCase() === 'expires' ||
            header.name.toLowerCase() === 'age' ||
            header.name.toLowerCase() === 'last-modified' ||
            header.name.toLowerCase() === 'host'
        )
        .reduce(
          (obj, item) => ((obj[toCamelCase(item.name)] = item.value), obj),
          {}
        ),
    },
  }));

  const filteredFile = JSON.stringify(entries);
  return filteredFile;
};

export default filterHarFile;

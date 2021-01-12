/* eslint-disable no-sequences */
/* eslint-disable import/no-anonymous-default-export */
const filterHarFile = (jsonContents) => {
  const toCamelCase = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

  const getUrlExtension = (url) => {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  };

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

  for (let i = 0; i < entries.length; i += 1) {
    if (entries[i].response.headers.contentType === undefined) {
      const extension = getUrlExtension(entries[i].request.url);
      if (
        extension === 'html' ||
        extension === 'htm' ||
        extension === 'php' ||
        extension === 'aspx' ||
        extension === 'asp' ||
        extension === 'jsp'
      ) {
        entries[i].response.headers.contentType = 'text/html';
      } else if (
        /(^((https)|(http)):\/\/(.[^/])+\/$)/.test(entries[i].request.url)
      ) {
        entries[i].response.headers.contentType = 'text/html';
      }
    }
    entries[i].request.url = new URL(entries[i].request.url).hostname;
    console.log(entries[i].request.url);
  }

  const filteredFile = JSON.stringify(entries);
  return filteredFile;
};

export default filterHarFile;

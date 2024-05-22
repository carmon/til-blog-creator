const getURLMatch = (url: string) => url.replaceAll('%20', ' ').match(/\/create\?code=([\w.-]+)&name=([\w\@.-]+)&title=([\w\@. -]+)/);

export default getURLMatch;
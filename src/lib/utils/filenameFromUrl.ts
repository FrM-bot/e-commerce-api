export const getFilenameFromAzureUrl = (url: string) => url.split('/').pop() ?? ''

export const getFilenameFromAzureUrls = (urls: string[]) => urls?.map(getFilenameFromAzureUrl)

/**
 * Downloads a file from the server to the client
 * @param {*} fileUrl The url of the file
 * @param {*} downloadName The name of the downloaded file
 */
export const downloadFile = (fileUrl, downloadName) => {
  // this function download a file by creating a link and clicking on it
  const link = document.createElement('a');

  link.href = fileUrl;
  link.download = downloadName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

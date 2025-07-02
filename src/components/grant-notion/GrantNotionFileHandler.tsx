
export const handleFileClick = (fileName: string) => {
  console.log('Clicking on file:', fileName);
  
  // Check if the text contains a direct URL (http/https)
  const urlMatch = fileName.match(/https?:\/\/[^\s]+/);
  if (urlMatch) {
    console.log('Found direct URL:', urlMatch[0]);
    // For direct URLs, try to download if it's a file, otherwise open
    const url = urlMatch[0];
    const downloadableExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.txt', '.csv'];
    const hasDownloadableExtension = downloadableExtensions.some(ext => url.toLowerCase().includes(ext));
    
    if (hasDownloadableExtension) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.split('/').pop() || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return;
  }
  
  // Check if it looks like a domain without protocol
  const possibleUrl = fileName.trim();
  if (possibleUrl.includes('.') && !possibleUrl.includes(' ') && possibleUrl.length < 100 && (possibleUrl.includes('.se') || possibleUrl.includes('.com') || possibleUrl.includes('.org') || possibleUrl.includes('.net') || possibleUrl.includes('.gov'))) {
    console.log('Treating as domain:', possibleUrl);
    window.open(`https://${possibleUrl}`, '_blank', 'noopener,noreferrer');
    return;
  }
  
  // Check if it's a downloadable file by extension - try direct download first
  const downloadableExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar', '.txt', '.csv'];
  const hasDownloadableExtension = downloadableExtensions.some(ext => fileName.toLowerCase().includes(ext));
  
  if (hasDownloadableExtension) {
    // Try to construct potential direct download URLs from common Swedish grant organizations
    const potentialUrls = [
      `https://www.vinnova.se/contentassets/${fileName}`,
      `https://www.vinnova.se/globalassets/${fileName}`,
      `https://www.vinnova.se/upload/${fileName}`,
      `https://www.energimyndigheten.se/contentassets/${fileName}`,
      `https://www.tillvaxtverket.se/download/${fileName}`,
      `https://www.formas.se/contentassets/${fileName}`
    ];
    
    // Try each potential URL
    let downloadAttempted = false;
    for (const url of potentialUrls) {
      try {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloadAttempted = true;
        console.log('Attempted download from:', url);
        break;
      } catch (error) {
        console.log('Failed to download from:', url);
        continue;
      }
    }
    
    // If direct download attempts fail, fall back to search
    if (!downloadAttempted) {
      const searchTerm = encodeURIComponent(fileName);
      const searchUrl = `https://www.google.com/search?q=${searchTerm}+filetype:${fileName.split('.').pop()?.toLowerCase() || 'pdf'}+site:vinnova.se`;
      console.log('Fallback: Searching for downloadable file:', searchUrl);
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
    return;
  }
  
  // Check for document-related keywords that should trigger a search
  const documentKeywords = ['beslutslista', 'mall', 'dokument', 'rules', 'villkor', 'intyg', 'formulär', 'ansökan', 'template', 'form', 'application', 'guidelines', 'regler', 'instruktion', 'manual', 'handbok', 'guide'];
  const containsDocumentKeyword = documentKeywords.some(keyword => fileName.toLowerCase().includes(keyword.toLowerCase()));
  
  if (containsDocumentKeyword) {
    // Try to search for the document on the organization's website
    const searchTerm = encodeURIComponent(fileName);
    const searchUrl = `https://www.google.com/search?q=${searchTerm}+site:vinnova.se`;
    console.log('Searching for document:', searchUrl);
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  
  // If nothing else matches, try a general search for the term
  const searchTerm = encodeURIComponent(fileName);
  const generalSearchUrl = `https://www.google.com/search?q=${searchTerm}+vinnova`;
  console.log('Performing general search:', generalSearchUrl);
  window.open(generalSearchUrl, '_blank', 'noopener,noreferrer');
};

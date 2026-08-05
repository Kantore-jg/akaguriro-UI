import { apiClient, extractData } from '../client.js';

function getFilenameFromDisposition(disposition) {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
  return asciiMatch?.[1] || null;
}

function downloadBlob(response, fallbackName) {
  const fileName = getFilenameFromDisposition(response.headers['content-disposition']) || fallbackName;
  const blob = new Blob([response.data], {
    type:
      response.headers['content-type']
      || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return fileName;
}

export async function exportExcelWorkbook() {
  const response = await apiClient.get('/admin/excel/export', {
    responseType: 'blob',
  });

  const defaultName = `akaguriro-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return downloadBlob(response, defaultName);
}

export async function downloadExcelTemplate() {
  const response = await apiClient.get('/admin/excel/template', {
    responseType: 'blob',
  });

  const defaultName = `akaguriro-modele-import-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return downloadBlob(response, defaultName);
}

export async function importExcelWorkbook(file) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post('/admin/excel/import', formData);
  return extractData({ data });
}

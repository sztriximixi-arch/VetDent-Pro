import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportReportToPdf(elementId: string, fileName: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    // Mentjük az eredeti stílusokat ha szükséges
    const canvas = await html2canvas(element, {
      scale: 2, // Magasabb felbontás a kristálytiszta betűkhöz és vonalakhoz
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Arányos skálázás
    const ratio = pdfWidth / imgWidth;
    const renderedHeight = imgHeight * ratio;

    let heightLeft = renderedHeight;
    let position = 0;

    // Első oldal
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, renderedHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Ha több oldalas a dokumentum
    while (heightLeft > 0) {
      position = heightLeft - renderedHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, renderedHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Hiba a PDF generálása során:', error);
    // Fallback nyomtatásra
    window.print();
    return false;
  }
}

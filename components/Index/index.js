import React, { useEffect, useState } from 'react';
import ImageCard from '../ImageCard/ImageCard';
import { PDFDocument, rgb } from 'pdf-lib';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Index() {
  // const [screenshots, setScreenshots] = useState(["https://plus.unsplash.com/premium_photo-1699553551923-73755578d942?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D", "https://plus.unsplash.com/premium_photo-1699553551923-73755578d942?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D",]);
  const [screenshots, setScreenshots] = useState([]);
  const [generatePDFLoading, setGeneratePDFLoading] = useState(false);

  useEffect(() => {
    console.log("UseEffect")
    chrome.storage?.local.get('screenshot', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to retrieve storage:', chrome.runtime.lastError);
        return;
      }
      const screenshots = result.screenshot || [];
      setScreenshots(screenshots);
      console.log("ScreenShots", screenshots)
    });
  }, []);

  const deleteScreenshot = (index) => {
    const updatedScreenshots = [...screenshots];
    updatedScreenshots.splice(index, 1);

    // Update the local storage
    chrome.storage?.local.set({ 'screenshot': updatedScreenshots }, () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to delete image:', chrome.runtime.lastError);
      } else {
        setScreenshots(updatedScreenshots);
        console.log('Image deleted from chrome.storage.local successfully');
      }
    });
  };

  // delete all screenshots
  const clearAll = () => {
    chrome.storage?.local.remove('screenshot', () => {
      if (chrome.runtime.lastError) {
        console.error('Failed to delete all images:', chrome.runtime.lastError);
      } else {
        setScreenshots([]);
        console.log('All images deleted from chrome.storage.local successfully');
      }
    });
  }

  const generatePDF = async () => {
    if (screenshots.length === 0) {
      alert('No screenshots saved.');
      return;
    }
    if (generatePDFLoading) return;
    setGeneratePDFLoading(true);
    const pdfDoc = await PDFDocument.create();

    for (const screenshot of screenshots) {
      const img = await fetch(screenshot).then(res => res.arrayBuffer());
      const imgType = screenshot.startsWith('data:image/jpeg') ? 'jpeg' : 'png';
      const imgEmbed = imgType === 'jpeg' ? await pdfDoc.embedJpg(img) : await pdfDoc.embedPng(img);

      const page = pdfDoc.addPage([imgEmbed.width, imgEmbed.height]);
      page.drawImage(imgEmbed, {
        x: 0,
        y: 0,
        width: imgEmbed.width,
        height: imgEmbed.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${Math.random().toString(36).substring(7)}.pdf`
    link.click();
    setGeneratePDFLoading(false);
  };

  return (
    <div className='w-[800px] h-[485px] p-5 text-gray-500 bg-black  overflow-y-scroll'>
      <div className='mb-10 flex gap-10 justify-end'>
        <button
          className='bg-orange-900 text-orange-300 hover:bg-orange-700 p-1 px-3 rounded-xl'
          onClick={clearAll}
        >
          Clear All
        </button>
        <button
          className='bg-orange-900 text-orange-300 hover:bg-orange-700 p-1 px-3 rounded-xl'
          onClick={generatePDF}
        >
          {generatePDFLoading ? <span> Generating... <AiOutlineLoading3Quarters className='animate-spin inline' /></span> : 'Generate PDF'}
        </button>
      </div>
      <div className="flex flex-wrap gap-3 justify-center items-center min-h-80">
        {screenshots.length > 0 ? (
          screenshots.map((screenshot, index) => (
            <section key={index} className="border border-gray-800 max-w-[200px] p-3 rounded-md h-fit relative">
              <ImageCard screenshot={screenshot} index={index} deleteScreenshot={deleteScreenshot} />
            </section>
          ))
        ) : (
          <p className='text-3xl'>No screenshots saved.</p>
        )}
      </div>
      <footer className='w-fit mx-auto mt-5 py-3'>
        Made with ❤️ by <a href="https://www.linkedin.com/in/kenil-kanani-5ab300219/" target="_blank" rel="noreferrer">Kenil Kanani</a>
      </footer>
    </div>
  );
}

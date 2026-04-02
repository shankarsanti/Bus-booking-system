import jsPDF from 'jspdf';
import { Booking } from '../services/bookingService';

interface TicketData extends Booking {
  busName?: string;
  busNumber?: string;
  busType?: string;
  source?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  date?: string;
}

export const generateTicketPDF = (booking: TicketData) => {
  try {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Header
    pdf.setFillColor(37, 99, 235); // Blue background
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('Bus Ticket', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('E-Ticket', pageWidth / 2, 30, { align: 'center' });
    
    // Reset text color
    pdf.setTextColor(0, 0, 0);
    
    // PNR Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PNR: ' + (booking.pnr || 'N/A'), 20, 55);
    
    // Booking Status
    pdf.setFontSize(10);
    pdf.setTextColor(34, 197, 94); // Green
    pdf.text('Status: ' + (booking.status || 'N/A').toUpperCase(), pageWidth - 20, 55, { align: 'right' });
    pdf.setTextColor(0, 0, 0);
    
    // Journey Details
    let yPos = 70;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Journey Details', 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    if (booking.source && booking.destination) {
      pdf.text(`From: ${booking.source}`, 20, yPos);
      pdf.text(`To: ${booking.destination}`, pageWidth / 2 + 10, yPos);
      yPos += 8;
    }
    
    if (booking.date) {
      pdf.text(`Date: ${booking.date}`, 20, yPos);
      yPos += 8;
    }
    
    if (booking.departureTime) {
      pdf.text(`Departure: ${booking.departureTime}`, 20, yPos);
    }
    if (booking.arrivalTime) {
      pdf.text(`Arrival: ${booking.arrivalTime}`, pageWidth / 2 + 10, yPos);
    }
    yPos += 15;
    
    // Bus Details
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Bus Details', 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    if (booking.busName) {
      pdf.text(`Bus Name: ${booking.busName}`, 20, yPos);
      yPos += 8;
    }
    
    if (booking.busNumber) {
      pdf.text(`Bus Number: ${booking.busNumber}`, 20, yPos);
    }
    if (booking.busType) {
      pdf.text(`Type: ${booking.busType}`, pageWidth / 2 + 10, yPos);
    }
    yPos += 15;
    
    // Passenger Details
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Passenger Details', 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    if (booking.passengerDetails && booking.passengerDetails.length > 0) {
      booking.passengerDetails.forEach((passenger, index) => {
        pdf.text(`${index + 1}. ${passenger.name || 'N/A'}`, 20, yPos);
        pdf.text(`Age: ${passenger.age || 'N/A'}`, pageWidth / 2, yPos);
        pdf.text(`Gender: ${passenger.gender || 'N/A'}`, pageWidth / 2 + 40, yPos);
        yPos += 8;
      });
    } else {
      pdf.text('No passenger details available', 20, yPos);
      yPos += 8;
    }
    
    yPos += 7;
    
    // Seat Details
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Seat Details', 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Seat Numbers: ${booking.seats?.join(', ') || 'N/A'}`, 20, yPos);
    
    yPos += 15;
    
    // Payment Details
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment Details', 20, yPos);
    
    yPos += 10;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Amount: ₹${booking.totalAmount || 0}`, 20, yPos);
    pdf.text(`Payment Status: ${booking.paymentStatus || 'N/A'}`, pageWidth / 2 + 10, yPos);
    
    yPos += 8;
    pdf.text(`Booking Date: ${booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}`, 20, yPos);
    
    // Footer
    yPos = pdf.internal.pageSize.getHeight() - 30;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Important: Please carry a valid ID proof during your journey.', pageWidth / 2, yPos, { align: 'center' });
    pdf.text('For support, contact: support@busticket.com', pageWidth / 2, yPos + 5, { align: 'center' });
    
    // Border
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(10, 45, pageWidth - 20, pdf.internal.pageSize.getHeight() - 60);
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadTicketPDF = (booking: TicketData) => {
  try {
    const pdf = generateTicketPDF(booking);
    pdf.save(`ticket-${booking.pnr || 'booking'}.pdf`);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download receipt. Please try again.');
  }
};

export const printTicketPDF = (booking: TicketData) => {
  try {
    const pdf = generateTicketPDF(booking);
    pdf.autoPrint();
    window.open(pdf.output('bloburl'), '_blank');
  } catch (error) {
    console.error('Error printing PDF:', error);
    alert('Failed to print receipt. Please try again.');
  }
};

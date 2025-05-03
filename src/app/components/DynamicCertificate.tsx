"use client";

import React, { useRef } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateProps {
  studentName: string;
  score: number;
}

const DynamicCertificate: React.FC<CertificateProps> = ({ studentName, score }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const element = certRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 20, width, height);
    pdf.save("certificate.pdf");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Paper
        ref={certRef}
        sx={{
          width: "100%",
          maxWidth: 800,
          minHeight: 400,
          background: "#fdf6e3",
          border: "6px double #444",
          borderRadius: 3,
          p: 5,
          mb: 4,
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="#3f51b5">
          🎓 Certificate of Achievement
        </Typography>

        <Typography variant="h6" mt={4}>
          This certificate is proudly presented to
        </Typography>

        <Typography variant="h3" fontWeight="bold" color="primary" mt={1}>
          {studentName}
        </Typography>

        <Typography variant="h6" mt={3}>
          For successfully completing the quiz with a score of
        </Typography>

        <Typography variant="h4" fontWeight="bold" mt={1} color="green">
          {score} / 100
        </Typography>

        <Typography variant="body1" mt={4}>
          Dated: {new Date().toLocaleDateString()}
        </Typography>
      </Paper>

      <Button variant="contained" color="success" onClick={handleDownload}>
        📥 Download as PDF
      </Button>
    </Box>
  );
};

export default DynamicCertificate;

"use client";

import { useSearchParams } from "next/navigation";
import { Box, Typography, Button, Paper } from "@mui/material";
import Image from "next/image";
import dummyCertificate from "../../../public/assets/certificate-demo.png"; 

const ResultPage = () => {
  const params = useSearchParams();
  const status = params.get("status");
  const score = params.get("score");
  const id = params.get("id");

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
        {status === "true" ? "🎉 Congratulations, You Passed!" : "❌ You Didn't Pass"}
      </Typography>

      <Typography variant="h6" textAlign="center" color="primary">
        Your Score: {score} / 100
      </Typography>

      {/* ✅ Dummy Certificate */}
      {status === "true" && (
        <Box mt={4} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" mb={2}>🎓 Your Certificate Preview</Typography>

          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 600,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Image
              src={dummyCertificate}
              alt="Certificate"
              layout="responsive"
              width={600}
              height={400}
              style={{ borderRadius: "8px" }}
            />
          </Paper>

          <Button
            href={`https://localhost:7285/api/Certificate/download/${id}`}
            target="_blank"
            variant="contained"
            color="success"
          >
            📥 Download Certificate
          </Button>
        </Box>
      )}

      <Box textAlign="center" mt={4}>
        <Button href="/quiz" variant="outlined" color="secondary">
          🔁 Take Another Quiz
        </Button>
      </Box>
    </Box>
  );
};

export default ResultPage;

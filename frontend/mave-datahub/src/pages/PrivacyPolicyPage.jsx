import React from "react";
import { Container, Paper, Typography, Box, Button, Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    // If there is history, go back; otherwise go to root
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              textTransform: "none",
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            Back
          </Button>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, color: "#1a202c" }}
          >
            Mave DataHub Privacy Policy
          </Typography>

          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 4, fontWeight: 600 }}
          >
            Last Updated: 16 June 2026
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            Mave DataHub is a web-based platform operated by Respirer Living
            Sciences Private Limited that provides users with real-time and
            historical air quality and environmental monitoring data collected
            from IoT devices deployed across various locations. The platform
            enables users to visualize, analyze, and monitor environmental
            conditions such as air pollution levels, device health, and related
            sensor outputs in an accessible manner.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            To provide access to the platform, we may collect limited
            account-related information such as user identifiers, email
            addresses where applicable, passwords stored securely in hashed form
            using bcrypt, user roles, and API keys associated with customer
            projects. In addition, we collect technical and security-related
            information including IP addresses, login timestamps, and audit logs
            that record user activity within the system. These records are used
            strictly for security, troubleshooting, and operational monitoring
            purposes.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            Mave DataHub processes device-generated data from IoT sensors,
            which may include measurements such as PM2.5, PM10, NO₂, SO₂, CO,
            O₃, temperature, humidity, device battery status, device identifiers
            such as IMEI numbers, and geographic coordinates (latitude and
            longitude). This data is collected from monitoring devices deployed
            in the field and is used to provide real-time and historical
            insights.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            The information collected is used to operate and maintain the
            platform, provide secure user authentication, display real-time and
            historical environmental data, manage API-based access to customer
            datasets, maintain system security, and generate audit logs for
            monitoring and compliance purposes.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            All data is stored securely on Google Cloud Platform in the
            asia-southeast1 (Singapore) region using a secure database as the
            primary database system. Access to data is strictly controlled and
            limited to authorized personnel only. Customers access their own
            data through secure API keys and authenticated accounts, while
            internal employees may access data only for operational and support
            requirements under role-based access controls. All access activities
            are logged and monitored.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            We implement appropriate technical and organizational security
            measures to protect data, including secure password hashing, access
            logging, role-based access restrictions, and cloud-level security
            controls.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            Data is retained as long as necessary for providing services or as
            required by the customer. User account data is retained while
            accounts remain active, and environmental and device data is
            retained based on customer requirements. Audit logs are retained for
            security and operational purposes. Users and customers may request
            deletion of their data at any time by contacting{" "}
            <Link href="mailto:solutions@yourdomain.com">
              solutions@yourdomain.com
            </Link>
            , subject to any legal or contractual obligations that may require
            retention.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            We do not sell personal data. Mave DataHub does not rely on
            third-party analytics cookies. Only essential session or
            authentication mechanisms may be used where required for platform
            functionality.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            Data is primarily stored in the Singapore region of Google Cloud
            Platform, and appropriate safeguards are applied to ensure
            protection during processing and access.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            Where applicable under GDPR, users have the right to access,
            correct, delete, restrict, or request portability of their personal
            data. Requests can be submitted to{" "}
            <Link href="mailto:solutions@yourdomain.com">
              solutions@yourdomain.com
            </Link>
            .
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
            We may update this Privacy Policy from time to time, and any changes
            will be published on this page with an updated revision date.
          </Typography>

          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, mb: 0 }}>
            For any questions regarding this Privacy Policy, please contact
            Respirer Living Sciences Private Limited at{" "}
            <Link href="mailto:solutions@yourdomain.com">
              solutions@yourdomain.com
            </Link>{" "}
            or visit{" "}
            <Link href="" target="_blank" rel="noopener noreferrer">
              Respirer Living Sciences Pvt. Ltd.
            </Link>
            .
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

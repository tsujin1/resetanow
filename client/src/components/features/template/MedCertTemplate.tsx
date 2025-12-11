import { forwardRef } from "react";

// --- 1. Import Fonts from Assets ---
// This ensures Vite bundles them and provides the correct URL
import glacialRegular from "@/assets/fonts/glacial-indifference.regular.otf";
import glacialBold from "@/assets/fonts/glacial-indifference.bold.otf";
import lobsterRegular from "@/assets/fonts/lobster.otf";

// --- Configuration ---
const BRAND_COLOR = "#1e293b"; // Slate-900 (Professional Dark)
const ACCENT_COLOR = "#64748b"; // Slate-500 (Subtle Grey)
const BG_COLOR = "#ffffff";

interface MedCertTemplateProps {
  data: {
    patientName?: string;
    age?: number | string;
    sex?: string;
    address?: string;
    date: string;
    reason: string;
    diagnosis: string;
    recommendation: string;
  };
  doctor: {
    name: string;
    title: string;
    specialty: string;
    contactNumber: string;
    email: string;
    licenseNo: string;
    ptrNo: string;
    s2No?: string;
    signatureUrl?: string | null;
  };
}

// --- RenderField Helper ---
const RenderField = ({
  value,
  minWidth = "60px",
  isBold = false,
}: {
  value?: string | number;
  minWidth?: string;
  isBold?: boolean;
}) => {
  if (value) {
    return (
      <span
        style={{
          fontWeight: isBold ? "700" : "500",
          color: BRAND_COLOR,
          borderBottom: `1px solid ${ACCENT_COLOR}`,
          padding: "0 4px",
          display: "inline-block",
          lineHeight: "1.2",
        }}
      >
        {value}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-block",
        borderBottom: `1px solid #cbd5e1`,
        margin: "0 4px",
        minWidth: minWidth,
        height: "1em",
        verticalAlign: "bottom",
      }}
    >
      &nbsp;
    </span>
  );
};

export const MedCertTemplate = forwardRef<HTMLDivElement, MedCertTemplateProps>(
  ({ data, doctor }, ref) => {
    // --- Date Render Logic ---
    const renderDate = (dateString: string) => {
      if (dateString) {
        const date = new Date(dateString);
        return (
          <span
            style={{
              fontWeight: "600",
              color: BRAND_COLOR,
              borderBottom: `1px solid ${ACCENT_COLOR}`,
              padding: "0 4px",
              display: "inline-block",
              lineHeight: "1.2",
            }}
          >
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        );
      }
      return <RenderField minWidth="150px" />;
    };

    return (
      <div ref={ref}>
        {/* Styles & Fonts */}
        {/* We use the imported variables (glacialRegular, etc.) inside the template string */}
        <style type="text/css">
          {`
            @font-face {
              font-family: 'Glacial';
              src: url('${glacialRegular}') format('opentype');
              font-weight: 400;
              font-style: normal;
            }
            @font-face {
              font-family: 'Glacial';
              src: url('${glacialBold}') format('opentype');
              font-weight: 700;
              font-style: normal;
            }
            @font-face {
              font-family: 'Lobster';
              src: url('${lobsterRegular}') format('opentype');
              font-weight: 400;
              font-style: normal;
            }
          `}
        </style>

        {/* Font Pre-loader (Invisible) to ensure they render in PDF/Print */}
        <div
          className="absolute top-0 left-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          <span
            style={{ fontFamily: "'Glacial', sans-serif", fontWeight: 400 }}
          >
            .
          </span>
          <span
            style={{ fontFamily: "'Glacial', sans-serif", fontWeight: 700 }}
          >
            .
          </span>
          <span style={{ fontFamily: "'Lobster', cursive" }}>.</span>
        </div>

        {/* --- MAIN PAGE CONTAINER (Fixed A4) --- */}
        <div
          id="printable-content"
          className="relative"
          style={{
            fontFamily: "'Glacial', sans-serif",
            fontSize: "12pt",
            width: "210mm",
            height: "297mm",
            padding: "0",
            boxSizing: "border-box",
            backgroundColor: BG_COLOR,
            color: "#334155",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* --- CONTENT WRAPPER --- */}
          <div
            className="relative z-10 flex flex-col"
            style={{
              padding: "15mm 20mm",
              paddingBottom: "70mm",
              height: "100%",
            }}
          >
            {/* 1. HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20mm",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 375 375"
                  style={{ width: "100%", height: "100%" }}
                >
                  <path
                    fill={BRAND_COLOR}
                    d="M 344.5625 80.023438 C 301.726562 67.417969 257.140625 24.589844 246.3125 34.738281 C 231.855469 47.011719 213.597656 53.941406 195.148438 57.585938 C 195.082031 36.628906 194.699219 43.257812 199.632812 37.5 C 206.835938 31.425781 206.65625 19.351562 200.085938 12.882812 C 187.816406 0.0625 167.066406 12.183594 170.191406 28.019531 C 170.773438 33.792969 175.394531 37.621094 179.371094 41.28125 C 180.300781 46.648438 179.761719 52.140625 179.910156 57.570312 C 164.191406 54.539062 148.769531 48.914062 135.433594 39.945312 C 131.234375 37.304688 127.601562 31.710938 121.933594 33.433594 C 101.878906 38.167969 69.722656 67.398438 32.847656 79.304688 C 22.242188 83.023438 10.769531 82.230469 0 85.214844 L 0 86.488281 C 11.894531 90.703125 25.109375 90.433594 37.394531 88.09375 C 41.226562 91.375 37.71875 95.972656 64.46875 87.390625 C 69.78125 92.730469 77.222656 89.113281 83.339844 87.523438 C 86.625 86.308594 89.941406 88.019531 93.179688 88.511719 C 97.652344 89.757812 102.089844 87.839844 106.515625 87.449219 C 110.492188 87.671875 114.40625 88.796875 118.394531 88.410156 C 122.625 88.078125 126.464844 86.128906 130.53125 85.078125 C 134.355469 85.46875 138.167969 87 142.066406 86.25 C 146.132812 85.589844 149.625 83.308594 153.390625 81.792969 C 161.4375 81.390625 160.1875 87.042969 180.136719 73.859375 C 180.570312 106.890625 181.261719 139.933594 181.484375 172.980469 C 152.242188 161.171875 114.007812 158.03125 108.359375 146.414062 C 106.109375 137.773438 113.714844 129.914062 121.4375 127.46875 C 130.078125 125.683594 139.0625 127.019531 147.78125 125.457031 C 156.960938 123.816406 160.726562 120.808594 169.148438 113.578125 C 169.832031 112.992188 169.707031 111.902344 168.910156 111.488281 C 156.65625 105.113281 157.910156 111.316406 137.90625 102.511719 C 133.742188 100.675781 129.027344 106.65625 121.964844 109.828125 C 112.515625 114.238281 103.035156 119.878906 97.277344 128.863281 C 91.09375 138.253906 92.535156 151.410156 99.527344 159.972656 C 112.300781 175.660156 140.980469 178.832031 168.136719 186.074219 C 164.054688 189.511719 159.902344 192.914062 156.542969 197.085938 C 147.648438 207.886719 143.519531 222.660156 145.953125 236.476562 C 148.921875 249.78125 161.207031 257.671875 172.21875 264.046875 C 164.074219 269.550781 155.941406 275.882812 151.457031 284.882812 C 138.613281 311.851562 158.800781 322.804688 181.308594 339.289062 C 173.949219 348.527344 163.425781 364.132812 169.441406 374.371094 C 172.234375 364.214844 169.746094 360.398438 183.933594 346.9375 C 184.339844 357.570312 184.246094 368.222656 184.398438 378.871094 C 186.46875 378.871094 188.539062 378.886719 190.609375 378.886719 C 190.683594 368.222656 190.773438 357.542969 190.996094 346.878906 C 205.808594 361.179688 202.441406 363.894531 205.609375 374.285156 C 206.71875 371.597656 207.902344 368.761719 207.199219 365.808594 C 206.042969 355.609375 199.96875 346.953125 193.546875 339.285156 C 214.449219 324.511719 232.636719 314.03125 225.976562 291.300781 C 222.828125 279.179688 212.808594 270.734375 202.863281 263.984375 C 225.414062 251.234375 234.683594 239.203125 227.476562 213.75 C 224.222656 202.347656 215.988281 193.273438 206.914062 186.011719 C 226.667969 180.660156 247.667969 178.257812 265.804688 168.191406 C 281.777344 159.613281 296.234375 130.269531 254.058594 110.339844 C 249.214844 108.289062 245.109375 103.519531 239.90625 102.492188 C 235.34375 101.589844 232.035156 106.144531 224.65625 107.054688 C 214.941406 108.25 201.15625 109.546875 206.386719 114.09375 C 210.851562 117.96875 216.296875 122.839844 222.125 124.40625 C 231.664062 126.972656 241.625 125.9375 251.328125 126.988281 C 259.773438 128.441406 268.113281 136.03125 266.914062 145.183594 C 263.847656 157.578125 225.003906 160.554688 193.546875 172.917969 C 193.683594 139.875 194.539062 106.828125 194.792969 73.785156 C 214.054688 86.507812 212.785156 81.769531 221.566406 81.734375 C 225.332031 83.292969 228.8125 85.707031 232.9375 86.234375 C 236.851562 86.894531 240.675781 85.515625 244.546875 85.140625 C 248.550781 86.144531 252.363281 88.035156 256.53125 88.394531 C 260.597656 88.890625 264.570312 87.644531 268.605469 87.417969 C 272.988281 87.914062 277.382812 89.714844 281.808594 88.5 C 285.03125 88.003906 288.332031 86.339844 291.617188 87.507812 C 297.738281 89.023438 305.164062 92.773438 310.425781 87.375 C 335.078125 95.882812 334.394531 91.515625 337.578125 88.140625 C 349.90625 90.660156 362.851562 90.179688 375.003906 86.910156 L 375.003906 85.46875 C 365.164062 82.046875 354.46875 83.1875 344.566406 80.023438 Z M 139.617188 111.371094 C 139.617188 116.660156 131.605469 116.667969 131.605469 111.371094 Z M 161.710938 234.449219 C 158.050781 218.683594 167.878906 202.511719 181.902344 195.523438 C 182.144531 214.632812 182.5625 233.742188 182.757812 252.855469 C 174.730469 248.234375 165.296875 243.582031 161.710938 234.449219 Z M 162.265625 308.746094 C 158.292969 304.140625 159.566406 297.40625 162.042969 292.410156 C 166.390625 283.964844 174.925781 279.121094 182.699219 274.304688 C 183.703125 292.636719 183.265625 311.023438 183.824219 329.371094 C 176.15625 323.054688 168.597656 316.425781 162.265625 308.746094 Z M 236.832031 115.371094 C 231.539062 115.371094 231.535156 107.363281 236.832031 107.363281 C 242.121094 107.363281 242.128906 115.371094 236.832031 115.371094 Z M 213.929688 294.496094 C 218.167969 306.625 213.1875 309.933594 191.171875 329.507812 C 191.5625 311.101562 191.578125 292.695312 192.101562 274.292969 C 200.578125 279.421875 209.996094 284.851562 213.929688 294.496094 Z M 213.582031 233.355469 C 210.644531 243.242188 200.414062 248.011719 192.207031 252.914062 C 192.566406 233.746094 192.734375 214.589844 193.136719 195.421875 C 206.726562 202.46875 216.449219 217.800781 213.582031 233.355469 Z"
                  />
                </svg>
              </div>

              <div style={{ flexGrow: 1, textAlign: "right" }}>
                <h1
                  style={{
                    fontFamily: "'Lobster', cursive",
                    fontSize: "24pt",
                    color: BRAND_COLOR,
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {doctor.name}, {doctor.title}
                </h1>
                <p
                  style={{
                    fontFamily: "'Glacial', sans-serif",
                    fontWeight: "700",
                    fontSize: "10pt",
                    color: ACCENT_COLOR,
                    textTransform: "uppercase",
                    margin: "4px 0 0 0",
                    letterSpacing: "1px",
                  }}
                >
                  {doctor.specialty}
                </p>
                <p
                  style={{
                    fontSize: "9pt",
                    color: ACCENT_COLOR,
                    margin: "2px 0 0 0",
                  }}
                >
                  {doctor.contactNumber} • {doctor.email}
                </p>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "15mm" }}>
              <h2
                style={{
                  fontSize: "22pt",
                  fontWeight: "700",
                  color: BRAND_COLOR,
                  letterSpacing: "3px",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Medical Certificate
              </h2>
            </div>

            {/* 2. BODY */}
            <div style={{ fontSize: "12pt", lineHeight: "1.8" }}>
              <p style={{ marginBottom: "8mm" }}>To whom it may concern,</p>

              <p style={{ textAlign: "justify" }}>
                This is to certify that{" "}
                <RenderField
                  value={data.patientName}
                  minWidth="200px"
                  isBold={true}
                />
                ,
                <RenderField value={data.age} minWidth="40px" /> years old,{" "}
                <RenderField value={data.sex} minWidth="60px" />, presently
                residing at{" "}
                <RenderField value={data.address} minWidth="250px" />, was
                examined / treated in this clinic on {renderDate(data.date)} for{" "}
                <RenderField value={data.reason} minWidth="150px" />.
              </p>

              {/* Clinical Findings */}
              <div
                style={{
                  marginTop: "10mm",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8mm",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "5mm",
                    borderRadius: "4px",
                    borderLeft: `4px solid ${BRAND_COLOR}`,
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      color: BRAND_COLOR,
                      fontSize: "10pt",
                      textTransform: "uppercase",
                      marginBottom: "2mm",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Assessment / Diagnosis
                  </p>
                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "#334155",
                      lineHeight: "1.5",
                    }}
                  >
                    {data.diagnosis || "No diagnosis provided."}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "5mm",
                    borderRadius: "4px",
                    borderLeft: `4px solid ${BRAND_COLOR}`,
                  }}
                >
                  <p
                    style={{
                      fontWeight: "700",
                      color: BRAND_COLOR,
                      fontSize: "10pt",
                      textTransform: "uppercase",
                      marginBottom: "2mm",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Recommendation
                  </p>
                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "#334155",
                      lineHeight: "1.5",
                    }}
                  >
                    {data.recommendation || "No recommendation provided."}
                  </p>
                </div>
              </div>

              <p
                style={{
                  marginTop: "10mm",
                  fontStyle: "italic",
                  fontSize: "10pt",
                  color: ACCENT_COLOR,
                }}
              >
                This certificate is issued upon the patient's request for
                whatever legal purpose it may serve, except for medicolegal
                matters.
              </p>
            </div>
          </div>

          {/* 3. ABSOLUTE FOOTER (FIXED POSITION) */}
          <div
            style={{
              position: "absolute",
              bottom: "30mm", // Lowered signature position by 10mm
              right: "20mm", // Fixed distance from right edge
              textAlign: "center",
              width: "300px",
              zIndex: 10, // On top
            }}
          >
            <div
              style={{
                height: "25mm",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                marginBottom: "2mm",
              }}
            >
              {doctor.signatureUrl && (
                <div className="relative w-full flex justify-center items-end">
                  <img
                    src={doctor.signatureUrl}
                    alt="Signature"
                    style={{
                      height: "auto",
                      maxHeight: "60px",
                      width: "auto",
                      maxWidth: "300px",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                      mixBlendMode: "multiply",
                    }}
                  />
                </div>
              )}
            </div>
            <div
              style={{
                borderBottom: `1px solid ${ACCENT_COLOR}`,
                marginBottom: "1mm",
              }}
            ></div>
            <p
              style={{
                fontWeight: "700",
                fontSize: "11pt",
                color: BRAND_COLOR,
                textTransform: "uppercase",
              }}
            >
              {doctor.name}, {doctor.title}
            </p>
            <div
              style={{ fontSize: "9pt", color: ACCENT_COLOR, marginTop: "1mm" }}
            >
              <span style={{ display: "block" }}>
                Lic No. {doctor.licenseNo}
              </span>
              <span style={{ display: "block" }}>PTR No. {doctor.ptrNo}</span>
              <span style={{ display: "block" }}>
                S2 No. {doctor.s2No || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

MedCertTemplate.displayName = "MedCertTemplate";

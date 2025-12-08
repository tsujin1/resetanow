import { forwardRef } from "react";

// --- Configuration ---
const BRAND_COLOR = "#1e293b"; // Slate-900

interface RxTemplateProps {
  data: {
    patientName?: string;
    age?: string | number;
    sex?: string;
    address?: string;
    date: string;
    diagnosis?: string;
    medications: {
      name: string;
      dosage: string;
      instructions: string;
      quantity: string;
    }[];
  };
  doctor: {
    name: string;
    title?: string;
    specialty: string;
    licenseNo: string;
    ptrNo: string;
    // s2No removed per request
  };
}

export const RxTemplate = forwardRef<HTMLDivElement, RxTemplateProps>(
  ({ data, doctor }, ref) => {
    return (
      <div ref={ref}>
        {/* FORCE PRINT SIZE (Half Letter) */}
        <style type="text/css" media="print">
          {`
            @page { 
                size: 140mm 216mm; 
                margin: 0; 
            }
            body { 
                margin: 0; 
                -webkit-print-color-adjust: exact; 
            }
          `}
        </style>

        {/* --- HALF LETTER CONTAINER --- */}
        <div 
            id="printable-content" 
            className="bg-white text-slate-900 relative flex flex-col box-border overflow-hidden"
            style={{
                width: "140mm",
                height: "216mm",
                padding: "12mm",
                fontFamily: "'Times New Roman', serif"
            }}
        >
          
          {/* 1. DOCTOR HEADER (With Emblem) */}
          <div className="flex items-center border-b-2 border-slate-800 pb-3 mb-4">
            
            {/* LOGO LEFT */}
            <div style={{ width: '45px', height: '45px', marginRight: '12px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 375" style={{ width: '100%', height: '100%' }}>
                    <path fill={BRAND_COLOR} d="M 344.5625 80.023438 C 301.726562 67.417969 257.140625 24.589844 246.3125 34.738281 C 231.855469 47.011719 213.597656 53.941406 195.148438 57.585938 C 195.082031 36.628906 194.699219 43.257812 199.632812 37.5 C 206.835938 31.425781 206.65625 19.351562 200.085938 12.882812 C 187.816406 0.0625 167.066406 12.183594 170.191406 28.019531 C 170.773438 33.792969 175.394531 37.621094 179.371094 41.28125 C 180.300781 46.648438 179.761719 52.140625 179.910156 57.570312 C 164.191406 54.539062 148.769531 48.914062 135.433594 39.945312 C 131.234375 37.304688 127.601562 31.710938 121.933594 33.433594 C 101.878906 38.167969 69.722656 67.398438 32.847656 79.304688 C 22.242188 83.023438 10.769531 82.230469 0 85.214844 L 0 86.488281 C 11.894531 90.703125 25.109375 90.433594 37.394531 88.09375 C 41.226562 91.375 37.71875 95.972656 64.46875 87.390625 C 69.78125 92.730469 77.222656 89.113281 83.339844 87.523438 C 86.625 86.308594 89.941406 88.019531 93.179688 88.511719 C 97.652344 89.757812 102.089844 87.839844 106.515625 87.449219 C 110.492188 87.671875 114.40625 88.796875 118.394531 88.410156 C 122.625 88.078125 126.464844 86.128906 130.53125 85.078125 C 134.355469 85.46875 138.167969 87 142.066406 86.25 C 146.132812 85.589844 149.625 83.308594 153.390625 81.792969 C 161.4375 81.390625 160.1875 87.042969 180.136719 73.859375 C 180.570312 106.890625 181.261719 139.933594 181.484375 172.980469 C 152.242188 161.171875 114.007812 158.03125 108.359375 146.414062 C 106.109375 137.773438 113.714844 129.914062 121.4375 127.46875 C 130.078125 125.683594 139.0625 127.019531 147.78125 125.457031 C 156.960938 123.816406 160.726562 120.808594 169.148438 113.578125 C 169.832031 112.992188 169.707031 111.902344 168.910156 111.488281 C 156.65625 105.113281 157.910156 111.316406 137.90625 102.511719 C 133.742188 100.675781 129.027344 106.65625 121.964844 109.828125 C 112.515625 114.238281 103.035156 119.878906 97.277344 128.863281 C 91.09375 138.253906 92.535156 151.410156 99.527344 159.972656 C 112.300781 175.660156 140.980469 178.832031 168.136719 186.074219 C 164.054688 189.511719 159.902344 192.914062 156.542969 197.085938 C 147.648438 207.886719 143.519531 222.660156 145.953125 236.476562 C 148.921875 249.78125 161.207031 257.671875 172.21875 264.046875 C 164.074219 269.550781 155.941406 275.882812 151.457031 284.882812 C 138.613281 311.851562 158.800781 322.804688 181.308594 339.289062 C 173.949219 348.527344 163.425781 364.132812 169.441406 374.371094 C 172.234375 364.214844 169.746094 360.398438 183.933594 346.9375 C 184.339844 357.570312 184.246094 368.222656 184.398438 378.871094 C 186.46875 378.871094 188.539062 378.886719 190.609375 378.886719 C 190.683594 368.222656 190.773438 357.542969 190.996094 346.878906 C 205.808594 361.179688 202.441406 363.894531 205.609375 374.285156 C 206.71875 371.597656 207.902344 368.761719 207.199219 365.808594 C 206.042969 355.609375 199.96875 346.953125 193.546875 339.285156 C 214.449219 324.511719 232.636719 314.03125 225.976562 291.300781 C 222.828125 279.179688 212.808594 270.734375 202.863281 263.984375 C 225.414062 251.234375 234.683594 239.203125 227.476562 213.75 C 224.222656 202.347656 215.988281 193.273438 206.914062 186.011719 C 226.667969 180.660156 247.667969 178.257812 265.804688 168.191406 C 281.777344 159.613281 296.234375 130.269531 254.058594 110.339844 C 249.214844 108.289062 245.109375 103.519531 239.90625 102.492188 C 235.34375 101.589844 232.035156 106.144531 224.65625 107.054688 C 214.941406 108.25 201.15625 109.546875 206.386719 114.09375 C 210.851562 117.96875 216.296875 122.839844 222.125 124.40625 C 231.664062 126.972656 241.625 125.9375 251.328125 126.988281 C 259.773438 128.441406 268.113281 136.03125 266.914062 145.183594 C 263.847656 157.578125 225.003906 160.554688 193.546875 172.917969 C 193.683594 139.875 194.539062 106.828125 194.792969 73.785156 C 214.054688 86.507812 212.785156 81.769531 221.566406 81.734375 C 225.332031 83.292969 228.8125 85.707031 232.9375 86.234375 C 236.851562 86.894531 240.675781 85.515625 244.546875 85.140625 C 248.550781 86.144531 252.363281 88.035156 256.53125 88.394531 C 260.597656 88.890625 264.570312 87.644531 268.605469 87.417969 C 272.988281 87.914062 277.382812 89.714844 281.808594 88.5 C 285.03125 88.003906 288.332031 86.339844 291.617188 87.507812 C 297.738281 89.023438 305.164062 92.773438 310.425781 87.375 C 335.078125 95.882812 334.394531 91.515625 337.578125 88.140625 C 349.90625 90.660156 362.851562 90.179688 375.003906 86.910156 L 375.003906 85.46875 C 365.164062 82.046875 354.46875 83.1875 344.566406 80.023438 Z M 139.617188 111.371094 C 139.617188 116.660156 131.605469 116.667969 131.605469 111.371094 Z M 161.710938 234.449219 C 158.050781 218.683594 167.878906 202.511719 181.902344 195.523438 C 182.144531 214.632812 182.5625 233.742188 182.757812 252.855469 C 174.730469 248.234375 165.296875 243.582031 161.710938 234.449219 Z M 162.265625 308.746094 C 158.292969 304.140625 159.566406 297.40625 162.042969 292.410156 C 166.390625 283.964844 174.925781 279.121094 182.699219 274.304688 C 183.703125 292.636719 183.265625 311.023438 183.824219 329.371094 C 176.15625 323.054688 168.597656 316.425781 162.265625 308.746094 Z M 236.832031 115.371094 C 231.539062 115.371094 231.535156 107.363281 236.832031 107.363281 C 242.121094 107.363281 242.128906 115.371094 236.832031 115.371094 Z M 213.929688 294.496094 C 218.167969 306.625 213.1875 309.933594 191.171875 329.507812 C 191.5625 311.101562 191.578125 292.695312 192.101562 274.292969 C 200.578125 279.421875 209.996094 284.851562 213.929688 294.496094 Z M 213.582031 233.355469 C 210.644531 243.242188 200.414062 248.011719 192.207031 252.914062 C 192.566406 233.746094 192.734375 214.589844 193.136719 195.421875 C 206.726562 202.46875 216.449219 217.800781 213.582031 233.355469 Z" />
                </svg>
            </div>

            {/* DOCTOR INFO RIGHT */}
            <div>
                <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900 leading-tight">
                {doctor.name}
                {doctor.title ? `, ${doctor.title}` : ""}
                </h1>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mt-1">
                {doctor.specialty}
                </p>
                <div className="text-[10px] mt-2 text-slate-500 font-sans leading-tight">
                <p>Clinic Address: City Hospital, Suite 404</p>
                <p>Tel: (02) 8123-4567 • Mon-Sat 8am-5pm</p>
                </div>
            </div>
          </div>

          {/* 2. PATIENT INFO */}
          <div className="text-[11px] font-sans mb-4 space-y-2">
            
            {/* Row 1: Patient Name & Date */}
            <div className="flex justify-between items-end">
                <div className="flex items-end w-[65%]">
                    <span className="font-bold mr-1 min-w-[45px]">Patient:</span>
                    <div className="flex-1 border-b border-slate-300 px-2 font-bold uppercase truncate">
                        {data.patientName || " "}
                    </div>
                </div>
                <div className="flex items-end w-[30%]">
                    <span className="font-bold mr-1">Date:</span>
                    <div className="flex-1 border-b border-slate-300 text-center">
                        {data.date}
                    </div>
                </div>
            </div>

            {/* Row 2: Address & Age/Sex */}
            <div className="flex justify-between items-end">
                <div className="flex items-end w-[65%]">
                    <span className="font-bold mr-1 min-w-[45px]">Address:</span>
                    <div className="flex-1 border-b border-slate-300 px-2 truncate">
                        {data.address || " "}
                    </div>
                </div>
                <div className="flex items-end w-[30%]">
                    <span className="font-bold mr-1">Age:</span>
                    <div className="w-8 border-b border-slate-300 text-center">{data.age}</div>
                    <span className="font-bold mx-1">Sex:</span>
                    <div className="flex-1 border-b border-slate-300 text-center">{data.sex}</div>
                </div>
            </div>
          </div>

          {/* 3. RX BODY */}
          <div className="flex-1 relative mt-4">
            {/* Watermark Rx Logo */}
            <div className="absolute -left-1 -top-2 text-slate-900 opacity-90">
                 <svg width="40" height="40" viewBox="0 0 256 256">
                    <path fill="currentColor" d="M31.5,104.8v94.7H48h16.6v-35.3v-35.3h16.7h16.8l22.2,29.5c12.2,16.2,22.3,29.8,22.4,30c0.2,0.5-7.7,11.2-37.4,50l-5.7,7.5H119h19.3l11.9-15.9c8.5-11.4,12-15.8,12.4-15.4c0.3,0.3,5.7,7.4,12,15.8l11.5,15.3l19.3,0.1c10.6,0,19.2,0,19.2-0.1c0-0.1-9.7-12.9-21.7-28.3c-11.9-15.5-21.7-28.3-21.7-28.6c0-0.3,9.6-13.4,21.3-29.2c11.8-15.8,21.5-28.9,21.7-29.3c0.3-0.4-3.5-0.6-18-0.6h-18.3L175,146.9c-7.1,9.4-13,17.1-13.1,17c-0.3,0-29.5-38.1-29.5-38.5c0-0.2,1.8-0.8,4.1-1.3c18-4.6,31.8-17.2,37.4-34.2c2.4-7.4,3-11.4,3-20.6c0-9.3-0.8-14.2-3.5-21.8c-6.8-19.3-22.3-31.8-44.9-36.4c-3.2-0.6-9.4-0.8-50.3-0.9L31.5,10V104.8z M122.5,41.1c4.6,1.7,7.3,3.1,10.3,5.6c6.9,5.7,10.6,14.8,10,24.5c-1,14.4-10,24.7-24.4,27.6c-3,0.6-7.6,0.7-28.7,0.7H64.6v-30v-30l27.1,0.1l27.1,0.1L122.5,41.1z"/>
                 </svg>
            </div>

            {/* Meds List */}
            <div className="pl-14 pt-2 space-y-5 font-sans">
              {data.medications.map((med, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-base text-slate-900">
                      {med.name} <span className="text-slate-700 font-medium ml-1">{med.dosage}</span>
                    </span>
                    <span className="font-bold text-base ml-2">#{med.quantity}</span>
                  </div>
                  <div className="text-slate-600 italic pl-1 text-xs">
                    <span className="not-italic font-bold mr-1">Sig:</span> {med.instructions}
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnosis */}
            {data.diagnosis && (
                 <div className="mt-8 ml-2 border-t border-dashed border-slate-300 pt-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Remarks:</p>
                    <p className="text-sm font-sans">{data.diagnosis}</p>
                 </div>
            )}
          </div>

          {/* 4. FOOTER (UPDATED SIGNATURE BLOCK) */}
          <div className="mt-auto pt-4">
             <div className="flex justify-end">
                 <div className="w-[60%] text-center">
                     {/* Signature Line */}
                     <div className="border-b border-slate-900 mb-1 h-10"></div> 
                     
                     {/* Name */}
                     <p className="font-bold uppercase text-xs">{doctor.name}</p>
                     
                     {/* License Numbers (Directly Under Name) */}
                     <div className="text-[8px] text-slate-500 font-sans leading-tight mt-1">
                        <p>Lic No: {doctor.licenseNo}</p>
                        <p>PTR No: {doctor.ptrNo}</p>
                     </div>
                 </div>
             </div>
          </div>

        </div>
      </div>
    );
  }
);

RxTemplate.displayName = "RxTemplate";
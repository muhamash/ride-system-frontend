import { Phone, Share2 } from "lucide-react";
import { useState } from "react";

export default function FloatActions() {
  const emergencyNumber = "+880123456789"; // Emergency call number
  const [open, setOpen] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${emergencyNumber}`;
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const shareText = `My location: https://www.google.com/maps?q=${latitude},${longitude}`;
        if (navigator.share) {
          navigator.share({ text: shareText });
        } else {
          alert("Share this link: " + shareText);
        }
      });
    } else {
      alert("Geolocation not supported by your browser");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {open && (
        <>
          <button
            onClick={handleShareLocation}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200"
          >
            <Share2 className="h-5 w-5" />
            Share Location
          </button>

          <button
            onClick={handleCall}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200"
          >
            <Phone className="h-5 w-5" />
            Emergency
          </button>
        </>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center bg-yellow-500 hover:bg-green-700 text-white h-12 w-12 rounded-full shadow-lg transition-all duration-200"
      >
        {open ? "X" : "sos"}
      </button>
    </div>
  );
}
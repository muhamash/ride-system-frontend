import { useMyToast } from "@/components/layouts/MyToast";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Facebook, MessageSquare, Phone, Share2, Twitter } from "lucide-react";
import { useState } from "react";

interface IFloatActions
{
  latitude: number;
  longitude: number;
}

export default function FloatActions({ latitude, longitude }: IFloatActions ) {
  const [open, setOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false); 
  const [shareUrls, setShareUrls] = useState<{
    whatsapp: string;
    twitter: string;
    facebook: string;
  } | null>(null);

  const { showToast } = useMyToast();

  const EMERGENCY_NUMBER = "+880123456789"; 

  const handleShareLocation = ( ) =>
  {
    showToast( { type: "info", message: "Recheck that you have allowed me your location information!" } );
    
    if ( !latitude || !longitude )
    {
      showToast( { type: "danger", message: "Geolocation not supported" } );
      return;
    }

    const googleMapsLink = `https://www.google.com/maps?q=${ latitude },${ longitude }`;
    const encodedLink = encodeURIComponent( googleMapsLink );

    setShareUrls( {
      whatsapp: `https://wa.me/?text=Hey i am riding on Let's Ride web app developed by github.com/muhamash; for security i am sharing  my location for testing purpose: ${ encodedLink }`,
      twitter: `https://twitter.com/intent/tweet?text=My location: ${ encodedLink }`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${ encodedLink }`,
    } );

    setShareOpen( ( prev ) => !prev );
  };

  const handleSocialClick = (platform: "whatsapp" | "twitter" | "facebook") => {
    if (!shareUrls) return;
    window.open(shareUrls[platform], "_blank");
  };

  const handleEmergencyCall = () => {
    window.location.href = `tel:${EMERGENCY_NUMBER}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* Social Share Buttons */}
      {shareOpen && shareUrls && (
        <div className="flex flex-col items-end space-y-2 mb-2">
          <Button
            variant="outline"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
            onClick={() => handleSocialClick("whatsapp")}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full"
            onClick={() => handleSocialClick("twitter")}
          >
            <Twitter className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-full"
            onClick={() => handleSocialClick("facebook")}
          >
            <Facebook className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Emergency Contact Button */}
      {open && (
        <Tooltip content="Call Emergency">
          <Button
            variant="destructive"
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
            onClick={handleEmergencyCall}
          >
            <Phone className="h-5 w-5" />
            Call
          </Button>
        </Tooltip>
      )}


      {open && (
        <Tooltip content="Share Location">
          <Button
            variant="primary"
            className="flex items-center gap-2 bg-pink-200"
            onClick={handleShareLocation}
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </Tooltip>
      )}

      <Button
        onClick={() => {
          setOpen(!open);
          if (!open) setShareOpen(false); 
        }}
        className="h-12 w-12 rounded-full bg-yellow-500 hover:bg-green-700 text-white shadow-lg"
      >
        {open ? "X" : "SOS"}
      </Button>
    </div>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Flag, AlertTriangle, InfoIcon } from "lucide-react"; // Adding icons for different severity levels

interface CrisisAlertProps {
  isOpen: boolean;
  onClose: () => void;
  triggers: string[];
  severity: 'low' | 'medium' | 'high';
  context: string[];
}

const CrisisAlert = ({ isOpen, onClose, triggers, severity, context }: CrisisAlertProps) => {
  console.log("Rendering CrisisAlert with severity:", severity);

  const getAlertStyle = () => {
    switch (severity) {
      case 'high':
        return {
          bgColor: 'bg-red-50 border-red-200',
          icon: <Flag className="text-red-600 mr-2" />,
          flagType: 'URGENT SUPPORT'
        };
      case 'medium':
        return {
          bgColor: 'bg-orange-50 border-orange-200',
          icon: <AlertTriangle className="text-orange-600 mr-2" />,
          flagType: 'SUPPORT RESOURCES'
        };
      default:
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          icon: <InfoIcon className="text-blue-600 mr-2" />,
          flagType: 'WELLNESS CHECK'
        };
    }
  };

  const { bgColor, icon, flagType } = getAlertStyle();

  const getTitle = () => {
    switch (severity) {
      case 'high':
        return 'Urgent Support Available';
      case 'medium':
        return 'Support Resources Available';
      default:
        return 'Wellness Check-In';
    }
  };

  const getDescription = () => {
    switch (severity) {
      case 'high':
        return 'We noticed some concerning content in your entry. Your life matters, and help is available 24/7.';
      case 'medium':
        return 'It seems you might be going through a challenging time. Professional support and talking to trusted ones can help.';
      default:
        return 'We noticed you might be experiencing some difficulties. Remember, sharing with others can make a difference.';
    }
  };

  const getResourceInfo = () => {
    switch (severity) {
      case 'high':
        return {
          title: 'Crisis Support Line',
          description: 'Call 0300 102 1234 to connect with a trained counselor immediately',
          urgentNote: 'Please reach out now - support is ready to help'
        };
      case 'medium':
        return {
          title: 'Support Options',
          description: 'Professional counselors at 0300 102 1234, or reach out to someone you trust',
          urgentNote: 'Taking the first step to talk can help'
        };
      default:
        return {
          title: 'Wellness Resources',
          description: 'Consider talking to friends, family, or call 0300 102 1234 for support',
          urgentNote: 'Remember, it\'s okay to ask for help'
        };
    }
  };

  const resource = getResourceInfo();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={`${bgColor} border-2`}>
        <AlertDialogHeader>
          <div className="flex items-center mb-2">
            {icon}
            <AlertDialogTitle 
              className={severity === 'high' ? 'text-red-600' : 
                severity === 'medium' ? 'text-orange-600' : 'text-blue-600'}
            >
              {flagType}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <p>{getDescription()}</p>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-lg">
                {resource.title}
              </p>
              <p className="text-sm text-gray-600">
                {resource.description}
              </p>
              {resource.urgentNote && (
                <p className={`mt-2 font-medium ${
                  severity === 'high' ? 'text-red-600' : 
                  severity === 'medium' ? 'text-orange-600' : 'text-blue-600'
                }`}>
                  {resource.urgentNote}
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className={
              severity === 'high' ? 'bg-red-600 hover:bg-red-700' : 
              severity === 'medium' ? 'bg-orange-600 hover:bg-orange-700' : 
              'bg-blue-600 hover:bg-blue-700'
            }
          >
            I understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CrisisAlert;

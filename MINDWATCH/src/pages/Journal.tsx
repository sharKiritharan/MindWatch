
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RatingPrompt from "@/components/journal/RatingPrompt";
import PreviousEntries from "@/components/journal/PreviousEntries";
import JournalEntry from "@/components/journal/JournalEntry";

interface Entry {
  id: string;
  date: Date;
  entry: string;
  rating: string;
  flags: string[];
}

// Local storage key for journal entries
const ENTRIES_STORAGE_KEY = 'journal_entries';

const Journal = () => {
  const navigate = useNavigate();
  const [entry, setEntry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRating, setShowRating] = useState(true);
  const [rating, setRating] = useState("");
  const [previousEntries, setPreviousEntries] = useState<Entry[]>([]);
  const [viewingPrevious, setViewingPrevious] = useState(false);

  useEffect(() => {
    console.log("Fetching entries...");
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    try {
      console.log("Fetching entries from local storage...");
      const storedEntries = localStorage.getItem(ENTRIES_STORAGE_KEY);
      const entries = storedEntries ? JSON.parse(storedEntries) : [];

      console.log("Received entries:", entries);
      setPreviousEntries(
        entries.map(entry => ({
          id: entry.id,
          date: new Date(entry.created_at),
          entry: entry.entry,
          rating: entry.rating,
          flags: entry.flags || []
        }))
      );
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your journal entries",
      });
    }
  };

  const checkForWarningFlags = (text: string): string[] => {
    const flags = [];
    const warningPhrases = [
      "suicide",
      "kill myself",
      "end it all",
      "give up",
      "worthless",
      "hopeless",
      "can't go on",
      "unwanted",
      "helpless",
      "outcast"
    ];

    warningPhrases.forEach(phrase => {
      if (text.toLowerCase().includes(phrase)) {
        flags.push(phrase);
      }
    });

    return flags;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting new entry...");
      const flags = checkForWarningFlags(entry);
      
      if (flags.length > 0) {
        toast({
          variant: "destructive",
          title: "We're here to help",
          description: "We've detected concerning content. Please reach out to a mental health professional or call the suicide prevention hotline: 0300 102 1234",
        });
      }

      // Get existing entries from localStorage
      const existingEntriesString = localStorage.getItem(ENTRIES_STORAGE_KEY);
      const existingEntries = existingEntriesString ? JSON.parse(existingEntriesString) : [];
      
      // Create new entry
      const newEntry = {
        id: crypto.randomUUID(),
        entry,
        rating,
        flags,
        created_at: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem(
        ENTRIES_STORAGE_KEY, 
        JSON.stringify([newEntry, ...existingEntries])
      );

      console.log("Entry saved successfully");
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      });

      // Reset form and show rating prompt for next entry
      fetchEntries();
      setEntry("");
      setShowRating(true);
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your journal entry",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    navigate("/auth");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleEntryDeleted = (id: string) => {
    console.log("Entry deleted:", id);
    fetchEntries();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <Dialog open={showRating} onOpenChange={setShowRating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How are you feeling today?</DialogTitle>
            <DialogDescription>
              Please rate your mood on a scale of 1-10
            </DialogDescription>
          </DialogHeader>
          <RatingPrompt
            onRatingSubmit={(value) => {
              setRating(value);
              setShowRating(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setViewingPrevious(!viewingPrevious)}
          >
            {viewingPrevious ? "New Entry" : "View Previous Entries"}
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {viewingPrevious ? (
          <PreviousEntries 
            entries={previousEntries} 
            onEntryDeleted={handleEntryDeleted}
          />
        ) : (
          <JournalEntry
            entry={entry}
            rating={rating}
            isSubmitting={isSubmitting}
            onEntryChange={setEntry}
            onSubmit={handleSubmit}
          />
        )}
      </div>
      
      <div className="mt-8 text-center text-gray-600 text-sm">
        mindwatch, by Shar K.
      </div>
    </div>
  );
};

export default Journal;


import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Entry {
  id: string;
  date: Date;
  entry: string;
  rating: string;
  flags: string[];
}

interface PreviousEntriesProps {
  entries: Entry[];
  onEntryDeleted: (id: string) => void;
}

const PreviousEntries = ({ entries, onEntryDeleted }: PreviousEntriesProps) => {
  const handleDelete = async (id: string) => {
    try {
      console.log("Attempting to delete entry with ID:", id);
      
      // Get existing entries from localStorage
      const existingEntriesString = localStorage.getItem('journal_entries');
      const existingEntries = existingEntriesString ? JSON.parse(existingEntriesString) : [];
      
      // Filter out the deleted entry
      const updatedEntries = existingEntries.filter(entry => entry.id !== id);
      
      // Save the updated list
      localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
      
      console.log("Entry deleted successfully");
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been removed successfully.",
      });
      
      onEntryDeleted(id);
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the journal entry",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Previous Entries</h2>
      <ScrollArea className="h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="w-full">Entry</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(entry.date, "PPP")}</TableCell>
                <TableCell>{entry.rating}/10</TableCell>
                <TableCell className="max-w-xl">
                  <div className="whitespace-pre-wrap break-words">
                    {entry.entry}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default PreviousEntries;

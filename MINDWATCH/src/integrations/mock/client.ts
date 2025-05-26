type JournalEntry = {
  id: string;
  created_at: string;
  entry: string;
  rating: string;
  flags: string[];
};

class MockClient {
  private getStoredEntries(): JournalEntry[] {
    const stored = localStorage.getItem('journal_entries');
    return stored ? JSON.parse(stored) : [];
  }

  private setStoredEntries(entries: JournalEntry[]): void {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }

  from(table: string) {
    if (table === 'journal_entries') {
      return {
        select: () => {
          return {
            order: (column: string, { ascending = true } = {}) => {
              const entries = this.getStoredEntries();
              return Promise.resolve({
                data: entries.sort((a, b) => {
                  if (ascending) {
                    return new Date(a[column]).getTime() - new Date(b[column]).getTime();
                  }
                  return new Date(b[column]).getTime() - new Date(a[column]).getTime();
                }),
                error: null
              });
            }
          };
        },
        insert: (data: Partial<JournalEntry>[]) => {
          const entries = this.getStoredEntries();
          const newEntries = data.map(entry => ({
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            entry: entry.entry || '',
            rating: entry.rating || '',
            flags: entry.flags || []
          }));
          
          this.setStoredEntries([...entries, ...newEntries]);
          return Promise.resolve({ data: newEntries, error: null });
        },
        delete: () => {
          return {
            match: (criteria: Partial<JournalEntry>) => {
              console.log("Attempting to delete with criteria:", criteria);
              const entries = this.getStoredEntries();
              const filteredEntries = entries.filter(entry => {
                return !Object.entries(criteria).every(([key, value]) => entry[key] === value);
              });
              
              this.setStoredEntries(filteredEntries);
              return Promise.resolve({ data: null, error: null });
            }
          };
        }
      };
    }
    throw new Error(`Table ${table} not supported`);
  }
}

export const supabase = new MockClient();
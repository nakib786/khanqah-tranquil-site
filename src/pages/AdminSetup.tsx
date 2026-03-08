import { useState, useEffect } from "react";
import { COLLECTIONS, checkCollectionExists, createCollection, type CollectionDef } from "@/lib/wixCollections";
import { CheckCircle2, XCircle, Loader2, Database, RefreshCw } from "lucide-react";

interface CollectionStatus {
  def: CollectionDef;
  exists: boolean | null; // null = checking
  creating: boolean;
  error?: string;
}

const AdminSetup = () => {
  const [statuses, setStatuses] = useState<CollectionStatus[]>(
    COLLECTIONS.map((def) => ({ def, exists: null, creating: false }))
  );
  const [checking, setChecking] = useState(true);

  const checkAll = async () => {
    setChecking(true);
    const updated = await Promise.all(
      COLLECTIONS.map(async (def) => {
        const exists = await checkCollectionExists(def._id);
        return { def, exists, creating: false } as CollectionStatus;
      })
    );
    setStatuses(updated);
    setChecking(false);
  };

  useEffect(() => {
    checkAll();
  }, []);

  const handleCreate = async (idx: number) => {
    setStatuses((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, creating: true, error: undefined } : s))
    );

    const result = await createCollection(statuses[idx].def);

    setStatuses((prev) =>
      prev.map((s, i) =>
        i === idx
          ? { ...s, creating: false, exists: result.success ? true : s.exists, error: result.error }
          : s
      )
    );
  };

  const handleCreateAll = async () => {
    const missing = statuses.map((s, i) => ({ s, i })).filter(({ s }) => s.exists === false);
    for (const { i } of missing) {
      await handleCreate(i);
    }
  };

  const missingCount = statuses.filter((s) => s.exists === false).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Wix CMS Setup</h1>
        </div>

        <p className="text-muted-foreground mb-6 text-sm">
          This page checks and creates the required Wix CMS collections for your site.
        </p>

        <div className="space-y-3 mb-6">
          {statuses.map((status, idx) => (
            <div
              key={status.def._id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div>
                <h3 className="font-semibold">{status.def.displayName}</h3>
                <p className="text-xs text-muted-foreground">
                  {status.def.fields.length} fields: {status.def.fields.map((f) => f.key).join(", ")}
                </p>
                {status.error && (
                  <p className="text-xs text-destructive mt-1">{status.error}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0 ms-4">
                {status.exists === null && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                {status.exists === true && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {status.exists === false && !status.creating && (
                  <button
                    onClick={() => handleCreate(idx)}
                    className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Create
                  </button>
                )}
                {status.creating && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={checkAll}
            disabled={checking}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-md border hover:bg-accent transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
            Re-check
          </button>
          {missingCount > 0 && (
            <button
              onClick={handleCreateAll}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Create All Missing ({missingCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;

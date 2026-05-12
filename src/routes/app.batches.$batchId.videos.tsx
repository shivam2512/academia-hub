import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Video, ExternalLink, Trash2, Maximize, Folder, FolderPlus, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/batches/$batchId/videos")({ component: VideosPage });

function getYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop() || null;
    }
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.slice(1) || null;
    }
  } catch (e) {}
  const m = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/);
  return m ? m[1] : null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
  return m ? m[1] : null;
}

function VideosPage() {
  const { batchId } = useParams({ from: "/app/batches/$batchId/videos" });
  const { user, hasAnyRole, isAdmin } = useAuth();
  const canAdd = isAdmin || hasAnyRole(["teacher"]);
  const [videos, setVideos] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [provider, setProvider] = useState<"youtube"|"vimeo"|"other">("youtube");
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);
  
  useEffect(() => {
    const handleFsChange = () => {
      const fsElement = document.fullscreenElement || (document as any).webkitFullscreenElement;
      if (!fsElement) {
        setFullscreenId(null);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  const load = async () => {
    const { data: videosData } = await supabase.from("video_recordings").select("*").eq("batch_id", batchId).order("created_at", { ascending: false });
    const { data: foldersData } = await supabase.from("video_folders").select("*").eq("batch_id", batchId).order("created_at", { ascending: true });
    setVideos(videosData ?? []);
    setFolders(foldersData ?? []);
  };
  useEffect(() => { load(); }, [batchId]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = (fd.get("title") as string)?.trim();
    const video_url = (fd.get("url") as string)?.trim();
    const description = (fd.get("description") as string)?.trim();
    if (!title || !video_url) { toast.error("Title and URL required"); return; }
    try { new URL(video_url); } catch { toast.error("Invalid URL"); return; }
    const { error } = await supabase.from("video_recordings").insert({
      batch_id: batchId, title, video_url, description, provider, uploaded_by: user?.id, folder_id: currentFolderId,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Video added"); setOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await supabase.from("video_recordings").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  const submitFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (new FormData(e.currentTarget).get("name") as string)?.trim();
    if (!name) return;
    const { error } = await supabase.from("video_folders").insert({
      batch_id: batchId, name, created_by: user?.id
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Folder created"); setOpenFolderDialog(false); load();
  };

  const removeFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this folder and ALL videos inside it?")) return;
    await supabase.from("video_folders").delete().eq("id", id);
    toast.success("Folder deleted"); load();
  };

  const toggleFullscreen = (id: string, e: React.MouseEvent) => {
    const container = (e.currentTarget.closest('.video-wrapper') as HTMLElement);
    if (!container) return;

    if (fullscreenId === id) {
      const fsElement = document.fullscreenElement || (document as any).webkitFullscreenElement;
      if (fsElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      }
      setFullscreenId(null);
      return;
    }

    // Try native fullscreen first
    if (container.requestFullscreen) {
      container.requestFullscreen()
        .then(() => setFullscreenId(id))
        .catch(() => {
          // Fallback to pseudo-fullscreen if native fails
          setFullscreenId(id);
        });
    } else if ((container as any).webkitRequestFullscreen) {
      (container as any).webkitRequestFullscreen();
      setFullscreenId(id);
    } else {
      // Fallback for iOS/Browsers without Fullscreen API
      setFullscreenId(id);
    }
  };

  const visibleVideos = videos.filter(v => v.folder_id === currentFolderId);
  const currentFolderName = folders.find(f => f.id === currentFolderId)?.name;

  return (
    <div className="p-8">
      <PageHeader 
        title={currentFolderId ? `Folder: ${currentFolderName}` : "Video recordings"} 
        description={currentFolderId ? "Videos inside this folder." : "Class recordings — organize with folders."}
        actions={<div className="flex gap-2">
          {currentFolderId && (
            <Button variant="outline" onClick={() => setCurrentFolderId(null)}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          )}
          {canAdd && !currentFolderId && (
            <Dialog open={openFolderDialog} onOpenChange={setOpenFolderDialog}>
              <DialogTrigger asChild><Button variant="outline"><FolderPlus className="h-4 w-4 mr-2" />New Folder</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>New Folder</DialogTitle></DialogHeader>
                <form onSubmit={submitFolder} className="space-y-4">
                  <div><Label htmlFor="folder-name">Folder Name</Label><Input id="folder-name" name="name" required autoFocus /></div>
                  <DialogFooter><Button type="submit">Create</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          {canAdd && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4 mr-2" />Add recording</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add recording</DialogTitle></DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                  <div><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
                  <div><Label>Provider</Label>
                    <Select value={provider} onValueChange={(v: any) => setProvider(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="vimeo">Vimeo</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label htmlFor="url">Video URL (use unlisted videos for privacy)</Label><Input id="url" name="url" type="url" required placeholder="https://youtube.com/watch?v=..." /></div>
                  <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={2} /></div>
                  <DialogFooter><Button type="submit">Add</Button></DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>}
      />

      {!currentFolderId && folders.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Folders</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders.map(f => (
              <Card key={f.id} className="p-4 flex items-center justify-between cursor-pointer hover:border-primary transition-colors shadow-sm hover:shadow-md" onClick={() => setCurrentFolderId(f.id)}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Folder className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="font-semibold">{f.name}</span>
                </div>
                {(isAdmin || f.created_by === user?.id) && (
                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10" onClick={(e) => removeFolder(f.id, e)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {visibleVideos.length === 0 && (!currentFolderId && folders.length === 0) ? (
        <Card className="p-12 text-center shadow-card"><Video className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">No recordings or folders yet.</p></Card>
      ) : visibleVideos.length === 0 && currentFolderId ? (
        <Card className="p-12 text-center shadow-card"><Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" /><p className="text-muted-foreground">This folder is empty.</p></Card>
      ) : visibleVideos.length > 0 ? (
        <div>
          {(!currentFolderId && folders.length > 0) && (
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Uncategorized Videos</h3>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleVideos.map(v => {
              const ytId = getYouTubeId(v.video_url);
              const vimeoId = getVimeoId(v.video_url);
              return (
                <Card key={v.id} className="overflow-hidden shadow-card hover:shadow-elegant transition-all">
                  <div className={cn(
                    "aspect-video bg-black relative overflow-hidden group video-wrapper transition-all duration-300",
                    fullscreenId === v.id && "fixed inset-0 z-[9999] w-screen h-screen aspect-auto flex items-center justify-center"
                  )}>
                    {/* Anti-click shields */}
                    <div className="absolute top-0 left-0 w-full h-[15%] min-h-[60px] z-10" title="Protected video" onContextMenu={(e) => e.preventDefault()} />
                    <div className="absolute bottom-0 left-0 w-[20%] max-w-[200px] h-[15%] min-h-[80px] z-10" title="Protected video" onContextMenu={(e) => e.preventDefault()} />
                    <div className="absolute bottom-0 right-0 w-[25%] max-w-[250px] h-[15%] min-h-[80px] z-10" title="Protected video" onContextMenu={(e) => e.preventDefault()} />
                    
                    {(ytId || vimeoId) && (
                      <button 
                        onClick={(e) => toggleFullscreen(v.id, e)} 
                        className={cn(
                          "absolute top-4 right-4 z-20 p-2 bg-black/60 text-white rounded-md transition-all hover:bg-black/80",
                          fullscreenId === v.id ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        )}
                        title={fullscreenId === v.id ? "Close Fullscreen" : "Toggle Fullscreen"}
                      >
                        {fullscreenId === v.id ? <X className="w-5 h-5" /> : <Maximize className="w-4 h-4" />}
                      </button>
                    )}

                    {ytId ? (
                      <iframe 
                        src={`https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&fs=1`} 
                        className={cn("w-full h-full", fullscreenId === v.id && "max-h-full max-w-full aspect-video shadow-2xl")} 
                        title={v.title} 
                        sandbox="allow-scripts allow-same-origin allow-presentation" 
                        allowFullScreen
                      />
                    ) : vimeoId ? (
                      <iframe 
                        src={`https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0`} 
                        className={cn("w-full h-full", fullscreenId === v.id && "max-h-full max-w-full aspect-video shadow-2xl")} 
                        title={v.title} 
                        sandbox="allow-scripts allow-same-origin allow-presentation" 
                        allowFullScreen
                      />
                    ) : isAdmin || v.uploaded_by === user?.id ? (
                      <a href={v.video_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full h-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                        <div className="text-center"><Video className="h-10 w-10 mx-auto mb-2" /><div className="text-sm">Open video</div></div>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-slate-900 text-slate-400">
                        <div className="text-center"><Video className="h-10 w-10 mx-auto mb-2 opacity-50" /><div className="text-sm">Video cannot be embedded</div></div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold flex-1">{v.title}</h3>
                      {(v.uploaded_by === user?.id || isAdmin) && (
                        <Button size="icon" variant="ghost" onClick={() => remove(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      )}
                    </div>
                    {v.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{v.description}</p>}
                    {(isAdmin || v.uploaded_by === user?.id) && (
                      <a href={v.video_url} target="_blank" rel="noreferrer" className="text-xs text-primary mt-2 inline-flex items-center gap-1">Open in new tab <ExternalLink className="h-3 w-3" /></a>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

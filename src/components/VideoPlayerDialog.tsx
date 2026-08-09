import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function VideoPlayerDialog({
  video,
  onOpenChange,
}: {
  video: { title: string; url: string } | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={video !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{video?.title}</DialogTitle>
        </DialogHeader>
        {video && (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={video.url}
            controls
            autoPlay
            className="aspect-video w-full rounded-xl bg-black"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

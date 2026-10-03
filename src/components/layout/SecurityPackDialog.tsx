import { useUi, uiStore } from '@/lib/ui';
import { Overlay } from '../ui/Overlay';
import { SecurityPackForm } from '../platform/SecurityPackForm';

export default function SecurityPackDialog() {
  const { securityPackOpen } = useUi();
  return (
    <Overlay open={securityPackOpen} onClose={() => uiStore.set({ securityPackOpen: false })} label="Request our security pack" side="center" widthClass="max-w-md">
      <div className="p-6">
        <h2 className="h3">Request our security pack</h2>
        <p className="mt-1 text-sm text-muted">Certifications, architecture and controls. Enter a work email.</p>
        <div className="mt-4"><SecurityPackForm id="dialog" /></div>
      </div>
    </Overlay>
  );
}

import { Visualizer } from '@/components/ui/configurator/Visualizer';
import { OptionsPanel } from '@/components/ui/configurator/OptionsPanel';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex w-full max-w-6xl mx-auto p-8 gap-8">
        {/* Left Side: Controls */}
        <div className="flex-1 min-w-[400px] max-w-[500px]">
          <OptionsPanel />
        </div>

        {/* Right Side: Visualizer */}
        <div className="flex-1">
          <Visualizer />
        </div>
      </div>
    </div>
  );
}

import { FlappyNatureGame } from '@repo/flappy-nature-game';
import { DemoPage } from './components/DemoPage.js';

export function App() {
  return (
    <DemoPage>
      <FlappyNatureGame showFps />
    </DemoPage>
  );
}

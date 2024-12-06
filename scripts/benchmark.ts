import Benchmark from 'benchmark';
import { CaptchaRenderer } from '../src/services/captcha/renderer';
import { ImageProcessor } from '../src/core/utils/image-processor';

const suite = new Benchmark.Suite();

const renderer = new CaptchaRenderer();
const imageProcessor = new ImageProcessor();

suite
  .add('CAPTCHA Generation', {
    defer: true,
    fn: async (deferred: any) => {
      await renderer.render({
        text: 'Test123',
        width: 300,
        height: 100,
        background: {
          pattern: 'grid',
          patternColor: '#f0f0f0'
        },
        noiseLevel: 0.3
      });
      deferred.resolve();
    }
  })
  .add('Image Processing', {
    defer: true,
    fn: async (deferred: any) => {
      const buffer = Buffer.from('test');
      await imageProcessor.processImage(buffer, {
        width: 300,
        height: 100,
        format: 'png'
      });
      deferred.resolve();
    }
  })
  .on('cycle', (event: any) => {
    console.log(String(event.target));
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
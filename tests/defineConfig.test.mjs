import { defineConfig } from '../src/framework/defineConfig.mjs';
import { describe, it, expect } from 'vitest';

describe('defineConfig', () => {
  it('should return the passed config object', () => {
    const sampleConfig = { setting: 'value' };
    expect(defineConfig(sampleConfig)).toEqual(sampleConfig);
  });

  it('should return an empty object if no config is passed', () => {
    expect(defineConfig()).toEqual({});
  });
});

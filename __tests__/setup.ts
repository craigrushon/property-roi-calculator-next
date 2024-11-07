import * as matchers from '@testing-library/jest-dom/matchers';
import { afterEach, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

import { render } from '@testing-library/react'
import type { ReactElement } from 'react'

function renderWithProviders(ui: ReactElement) {
  return {
    ...render(ui),
  }
}

// Re-export everything
export * from '@testing-library/react'
export { renderWithProviders as render } 
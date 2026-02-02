import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { QuestionOptions } from './QuestionOptions'

describe('QuestionOptions', () => {
  const options = ['A', 'B', 'C']
  const onSelect = vi.fn()

  const renderComponent = (props?: Partial<React.ComponentProps<typeof QuestionOptions>>) =>
    render(<QuestionOptions options={options} showFeedback={false} onSelect={onSelect} {...props} />)

  it('renders correctly', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument()
  })

  it('renders all options as buttons', () => {
    renderComponent()

    options.forEach((option) => {
      expect(
        screen.getByRole('button', { name: option })
      ).toBeInTheDocument()
    })
  })

  it('calls onSelect with correct option value', async () => {
    onSelect.mockClear()

    renderComponent()

    await userEvent.click(screen.getByRole('button', { name: 'B' }))

    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith('B')
  })

  it('does not allow selection when showFeedback is true', async () => {
    onSelect.mockClear()

    renderComponent({ showFeedback: true, selectedOption: 'A', correctOption: 'A' })

    await userEvent.click(screen.getByRole('button', { name: 'C' }))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('disables all buttons when feedback is shown', () => {
    renderComponent({ showFeedback: true })

    options.forEach((option) => {
      expect(
        screen.getByRole('button', { name: option })
      ).toBeDisabled()
    })
  })
})
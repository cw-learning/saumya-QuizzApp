import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { QuestionOptions } from './QuestionOptions'

describe('QuestionOptions', () => {
  const options = ['A', 'B', 'C']

  it('renders all options as buttons', () => {
    render(
      <QuestionOptions
        options={options}
        showFeedback={false}
        onSelect={vi.fn()}
      />
    )

    options.forEach((option) => {
      expect(
        screen.getByRole('button', { name: option })
      ).toBeInTheDocument()
    })
  })

  it('calls onSelect with correct option value', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <QuestionOptions
        options={options}
        showFeedback={false}
        onSelect={onSelect}
      />
    )

    await user.click(screen.getByRole('button', { name: 'B' }))

    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith('B')
  })

  it('does not allow selection when showFeedback is true', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <QuestionOptions
        options={options}
        selectedOption="A"
        correctOption="A"
        showFeedback={true}
        onSelect={onSelect}
      />
    )

    await user.click(screen.getByRole('button', { name: 'C' }))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('disables all buttons when feedback is shown', () => {
    render(
      <QuestionOptions
        options={options}
        showFeedback={true}
        onSelect={vi.fn()}
      />
    )

    options.forEach((option) => {
      expect(
        screen.getByRole('button', { name: option })
      ).toBeDisabled()
    })
  })
})

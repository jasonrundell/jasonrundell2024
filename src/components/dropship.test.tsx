import { render, screen } from '@testing-library/react'
import {
  Blockquote,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  Link,
  Row,
  Spacer,
} from './dropship'

describe('dropship compatibility components', () => {
  it('renders Row with Dropship class names and CSS variables', () => {
    render(
      <Row justify="center" align="stretch" data-testid="row">
        Content
      </Row>
    )

    const row = screen.getByTestId('row')
    expect(row).toHaveClass('s1kfkqp6')
    expect(row).toHaveStyle({
      '--s1kfkqp6-0': 'center',
      '--s1kfkqp6-1': 'stretch',
    })
  })

  it('renders Grid with responsive template variables', () => {
    render(
      <Grid
        columnGap="1rem"
        rowGap="2rem"
        gridTemplateColumns="1fr"
        mediumTemplateColumns="1fr 1fr"
        largeTemplateColumns="repeat(3, 1fr)"
        data-testid="grid"
      />
    )

    const grid = screen.getByTestId('grid')
    expect(grid).toHaveClass('s1w3m6ls')
    expect(grid).toHaveStyle({
      '--s1w3m6ls-0': '1rem',
      '--s1w3m6ls-1': '2rem',
      '--s1w3m6ls-2': '1fr',
      '--s1w3m6ls-3': '1fr 1fr',
      '--s1w3m6ls-4': 'repeat(3, 1fr)',
    })
  })

  it('renders Spacer with default and responsive size classes', () => {
    const { rerender } = render(<Spacer data-testid="spacer" />)

    expect(screen.getByTestId('spacer')).toHaveClass(
      's1j1ckvc',
      's1j1ckvc-2',
      's1j1ckvc-7',
      's1j1ckvc-12'
    )

    rerender(
      <Spacer
        smallScreen="xlarge"
        mediumScreen="medium"
        largeScreen="xsmall"
        data-testid="spacer"
      />
    )

    expect(screen.getByTestId('spacer')).toHaveClass(
      's1j1ckvc-5',
      's1j1ckvc-8',
      's1j1ckvc-11'
    )
  })

  it('renders Heading at the requested level', () => {
    render(<Heading level={3}>Section title</Heading>)

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveClass('safy9og', 'safy9og-3')
  })

  it('renders Blockquote with quote color variables', () => {
    render(
      <Blockquote color="tomato" data-testid="quote">
        Quote
      </Blockquote>
    )

    expect(screen.getByTestId('quote')).toHaveClass('slq3ov4')
    expect(screen.getByTestId('quote')).toHaveStyle({
      '--slq3ov4-0': 'tomato',
      '--slq3ov4-1': 'tomato',
    })
  })

  it('renders Box variants', () => {
    const { rerender } = render(<Box isRoomy data-testid="box" />)
    expect(screen.getByTestId('box')).toHaveClass('snisusl', 'snisusl-1')

    rerender(<Box isTight data-testid="box" />)
    expect(screen.getByTestId('box')).toHaveClass('snisusl-2')

    rerender(<Box data-testid="box" />)
    expect(screen.getByTestId('box')).toHaveClass('snisusl-3')
  })

  it('renders Button variants', () => {
    const { rerender } = render(<Button label="Save" primary size="small" />)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      's14painh',
      's14painh-1',
      's14painh-4'
    )

    rerender(<Button label="Cancel" size="large" />)
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
      's14painh-3',
      's14painh-5'
    )
  })

  it('renders Container and Link compatibility components', () => {
    render(
      <>
        <Container data-testid="container" />
        <Link href="/contact" label="Contact" />
      </>
    )

    expect(screen.getByTestId('container')).toHaveClass('sywgbre')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveClass('swintyh')
  })
})

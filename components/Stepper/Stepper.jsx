import cx from 'classnames'

const StepperContext = React.createContext()
const useStepperContext = () => React.useContext(StepperContext)

const Stepper = ({ children, className, ...props }) => {
  const [currentStep, setCurrentStep] = React.useState(0)

  return (
    <StepperContext.Provider value={{ currentStep, setCurrentStep }}>
      <div className={cx('flex flex-col', className)} {...props}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}

const Indicators = ({ children, className, activeClassName = '', ...rest }) => {
  const { currentStep, setCurrentStep } = useStepperContext()

  return (
    <ul className={cx('flex flex-row justify-around', className)} {...rest}>
      {React.Children.map(children, (child, index) => {
        if (child.type === Indicator) {
          const {
            onClick,
            className: childClassName,
            ...childProps
          } = child.props
          const isActive = currentStep === index
          return (
            <li key={index}>
              {React.cloneElement(child, {
                onClick: () => setCurrentStep(index),
                className: cx(childClassName, { [activeClassName]: isActive }),
                isActive,
                ...childProps,
              })}
            </li>
          )
        }
      })}
    </ul>
  )
}

const Indicator = ({
  children,
  className,
  activeClassName = '',
  onClick,
  isActive,
  ...rest
}) => {
  return (
    <button
      className={cx(className, { [activeClassName]: isActive })}
      onClick={onClick}
      type="button"
      {...rest}
    >
      {children}
    </button>
  )
}

const Contents = ({ children, className, ...rest }) => {
  const { currentStep } = useStepperContext()
  let childrenRefs = []

  React.useEffect(() => {
    childrenRefs[currentStep].current.scrollIntoView({
      inline: 'start',
      block: 'nearest',
    })
  }, [currentStep])

  return (
    <ul
      className={cx(
        'overflow-x-hidden grid grid-rows-1 grid-auto-cols-full grid-flow-col',
        className
      )}
      {...rest}
    >
      {React.Children.map(children, (child, index) => {
        if (child.type === StepContent) {
          const ref = React.useRef()
          childrenRefs.push(ref)
          return React.cloneElement(child, {
            ref,
            ...child.props,
            key: index,
          })
        }
      })}
    </ul>
  )
}

const StepContent = React.forwardRef(
  ({ children, className, ...rest }, ref) => {
    return (
      <li className={cx('w-full', className)} ref={ref} {...rest}>
        {children}
      </li>
    )
  }
)

export { Stepper, Indicators, Indicator, Contents, StepContent }

import {
    animate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
  } from "framer-motion";
  import { useEffect, useRef, useState } from "react";
  import styles from './Slider.module.css';
  
  const MAX_OVERFLOW = 50;
  
  export default function ElasticSlider({
    defaultValue = 50,
    startingValue = 0,
    maxValue = 100,
    className = "",
    isStepped = false,
    stepSize = 1,
    leftIcon = <span>−</span>,
    rightIcon = <span>+</span>,
    onChange = null,
  }) {
    return (
      <div className={`${styles.sliderContainer} ${className}`}>
        <Slider
          defaultValue={defaultValue}
          startingValue={startingValue}
          maxValue={maxValue}
          isStepped={isStepped}
          stepSize={stepSize}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          onChange={onChange}
        />
      </div>
    );
  }
  
  function Slider({
    defaultValue,
    startingValue,
    maxValue,
    isStepped,
    stepSize,
    leftIcon,
    rightIcon,
    onChange,
  }) {
    const [value, setValue] = useState(defaultValue);
    const sliderRef = useRef(null);
    const [region, setRegion] = useState("middle");
    const clientX = useMotionValue(0);
    const overflow = useMotionValue(0);
    const scale = useMotionValue(1);
  
    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);

    // Call onChange when value changes
    useEffect(() => {
      if (onChange && typeof onChange === 'function') {
        onChange(value);
      }
    }, [value, onChange]);
  
    useMotionValueEvent(clientX, "change", (latest) => {
      if (sliderRef.current) {
        const { left, right } = sliderRef.current.getBoundingClientRect();
        let newValue;
  
        if (latest < left) {
          setRegion("left");
          newValue = left - latest;
        } else if (latest > right) {
          setRegion("right");
          newValue = latest - right;
        } else {
          setRegion("middle");
          newValue = 0;
        }
  
        overflow.jump(decay(newValue, MAX_OVERFLOW));
      }
    });
  
    const handlePointerMove = (e) => {
      if (e.buttons > 0 && sliderRef.current) {
        const { left, width } = sliderRef.current.getBoundingClientRect();
        let newValue = startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);
  
        if (isStepped) {
          newValue = Math.round(newValue / stepSize) * stepSize;
        }
  
        newValue = Math.min(Math.max(newValue, startingValue), maxValue);
        setValue(newValue);
        clientX.jump(e.clientX);
      }
    };
  
    const handlePointerDown = (e) => {
      handlePointerMove(e);
      e.currentTarget.setPointerCapture(e.pointerId);
    };
  
    const handlePointerUp = () => {
      animate(overflow, 0, { type: "spring", bounce: 0.5 });
    };
  
    const getRangePercentage = () => {
      const totalRange = maxValue - startingValue;
      if (totalRange === 0) return 0;
  
      return ((value - startingValue) / totalRange) * 100;
    };
  
    return (
      <>
        <motion.div
          onHoverStart={() => animate(scale, 1.2)}
          onHoverEnd={() => animate(scale, 1)}
          onTouchStart={() => animate(scale, 1.2)}
          onTouchEnd={() => animate(scale, 1)}
          style={{
            scale,
            opacity: useTransform(scale, [1, 1.2], [0.7, 1]),
          }}
          className={styles.sliderWrapper}
        >
          <motion.div
            animate={{
              scale: region === "left" ? [1, 1.4, 1] : 1,
              transition: { duration: 0.25 },
            }}
            style={{
              x: useTransform(() =>
                region === "left" ? -overflow.get() / scale.get() : 0,
              ),
            }}
            className={styles.icon}
          >
            {leftIcon}
          </motion.div>
  
          <div
            ref={sliderRef}
            className={styles.sliderRoot}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <motion.div
              style={{
                scaleX: useTransform(() => {
                  if (sliderRef.current) {
                    const { width } = sliderRef.current.getBoundingClientRect();
                    return 1 + overflow.get() / width;
                  }
                }),
                scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                transformOrigin: useTransform(() => {
                  if (sliderRef.current) {
                    const { left, width } = sliderRef.current.getBoundingClientRect();
                    return clientX.get() < left + width / 2 ? "right" : "left";
                  }
                }),
                height: useTransform(scale, [1, 1.2], [6, 12]),
                marginTop: useTransform(scale, [1, 1.2], [0, -3]),
                marginBottom: useTransform(scale, [1, 1.2], [0, -3]),
              }}
              className={styles.sliderTrackWrapper}
            >
              <div className={styles.sliderTrack}>
                <div
                  className={styles.sliderRange}
                  style={{ width: `${getRangePercentage()}%` }}
                />
              </div>
            </motion.div>
          </div>
  
          <motion.div
            animate={{
              scale: region === "right" ? [1, 1.4, 1] : 1,
              transition: { duration: 0.25 },
            }}
            style={{
              x: useTransform(() =>
                region === "right" ? overflow.get() / scale.get() : 0,
              ),
            }}
            className={styles.icon}
          >
            {rightIcon}
          </motion.div>
        </motion.div>
      </>
    );
  }
  
  function decay(value, max) {
    if (max === 0) {
      return 0;
    }
  
    const entry = value / max;
    const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  
    return sigmoid * max;
  }

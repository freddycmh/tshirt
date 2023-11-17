// ColorPicker.js

import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { useSnapshot } from 'valtio';
import { state } from './store';

const ColorPicker = () => {
  const snap = useSnapshot(state);
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color) => {
    state.selectedColor = color.hex;
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const pickerStyles = {
    default: {
      picker: {
        boxShadow: 'none',
      },
    },
  };

  return (
    <div className="color-options">
      <div className="circle" style={{ background: snap.selectedColor }} onClick={togglePicker}></div>
      {showPicker && (
        <SketchPicker
          color={snap.selectedColor}
          onChange={handleColorChange}
          styles={pickerStyles}
        />
      )}
    </div>
  );
};

export default ColorPicker;

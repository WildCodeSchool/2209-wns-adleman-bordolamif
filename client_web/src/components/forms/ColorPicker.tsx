import { defaultColors } from '@utils/defaultColors';
import { useState } from 'react';
import { CirclePicker, ColorResult } from 'react-color';

interface Props {
    color: string,
    handleColorChange:(colorResult: ColorResult) => void
}

function ColorPicker(props:Props) {
  const {
    color, handleColorChange,
  } = props;

  const [pickerVisible, setPickerVisbile] = useState(false);

  const handleColorPicker = () => { setPickerVisbile(!pickerVisible); };

  return (
    <div>
      <div>
        <button type="button" className="bg-white rounded-xl cursor-pointer" onClick={handleColorPicker}>
          <div className="w-12 h-8 m-1 rounded-xl" style={{ backgroundColor: `${color}` }} />
        </button>
      </div>
      {pickerVisible
      && (
        <div className="absolute bg-gray-100 rounded-xl p-2 shadow-xl">
          <CirclePicker
            colors={defaultColors}
            onChangeComplete={handleColorChange}
          />
        </div>
      )}
    </div>
  );
}

export default ColorPicker;

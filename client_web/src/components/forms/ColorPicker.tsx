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
            colors={['#FF66FC', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b', '#1E1D1E']}
            onChangeComplete={handleColorChange}
          />
        </div>
      )}
    </div>
  );
}

export default ColorPicker;

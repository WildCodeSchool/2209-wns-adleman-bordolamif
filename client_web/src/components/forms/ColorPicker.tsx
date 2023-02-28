import { useState } from 'react';
import { ChromePicker, ColorResult } from 'react-color';

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
    <>
      <button type="button" className="p-1 bg-white rounded shadow inline-block cursor-pointer" onClick={handleColorPicker}>
        <div className="w-14 h-6 rounded" style={{ backgroundColor: `${color}` }} />
      </button>
      {pickerVisible && <ChromePicker color={color} onChangeComplete={handleColorChange} />}
    </>
  );
}

export default ColorPicker;

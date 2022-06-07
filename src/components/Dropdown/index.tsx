import { FC, useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { CaretBtmIcon } from 'src/assets/svg';
import s from './styles.module.scss';

export interface DropdownItem {
  id?: string;
  label: string;
  imgUrl?: string;
  onClick?: () => void;
}

export interface IProps {
  name?: string;
  items: DropdownItem[];
  rightAligned?: boolean;
  disabled?: boolean;
  isSelectDropdown?: boolean;
  label?: string;
  togglerLabel?: string;
  selectedId?: string;
  className?: string;
  onSelect?: (id: string) => void;
}

const Dropdown: FC<IProps> = ({
  children,
  items,
  rightAligned,
  disabled,
  isSelectDropdown,
  label,
  togglerLabel,
  selectedId: selectedIdFromProps = '',
  className,
  onSelect,
}) => {
  const [selectedId, setSelectedId] = useState(selectedIdFromProps);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId !== selectedIdFromProps) {
      setSelectedId(selectedIdFromProps);
    }
  }, [selectedIdFromProps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const clickOutsideHandler = ({ target }: any) => {
      if (isOpen && target !== dropdownRef.current && !dropdownRef?.current?.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', clickOutsideHandler);
    return () => {
      document.removeEventListener('click', clickOutsideHandler);
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = ({ id, onClick }: DropdownItem) => {
    setIsOpen(false);
    if (onClick) {
      onClick();
    }
    if (id) {
      if (isSelectDropdown) {
        setSelectedId(id);
      }
      if (onSelect) {
        onSelect(id);
      }
    }
  };

  const renderSelectLabel = () => {
    const selectedItem = items?.find((item) => item.id === selectedId);
    if (selectedId && selectedItem) {
      return (
        <>
          {selectedItem.imgUrl && <img src={selectedItem.imgUrl} alt={selectedItem.label} />}
          {selectedItem.label}
        </>
      );
    }
    return <span>{togglerLabel}</span>;
  };

  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  return (
    <div
      className={cn(s.dropdown, 'dropdown', { [s._open]: isOpen, [s._right]: rightAligned, [s._disabled]: disabled }, className)}
      ref={dropdownRef}
    >
      {label && <p className={s.dropdownLabel}>{label}</p>}
      <div className={s.dropdownToggler} onClick={toggleDropdown}>
        {isSelectDropdown
          ? (
            <div className={s.dropdownTogglerBox}>
              <p>{renderSelectLabel()}</p><CaretBtmIcon />
            </div>
          )
          : children
        }
      </div>
      <div className={s.dropdownItems}>
        {isOpen && items?.map((item) => {
          const { id, label: itemLabel, imgUrl } = item;
          return (
            <div
              key={id || itemLabel}
              className={cn(s.dropdownItem, { [s._selected]: id === selectedId })}
              onClick={() => handleSelect(item)}
            >
              {imgUrl && <img src={imgUrl} alt={label} />}
              <p>{itemLabel}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;

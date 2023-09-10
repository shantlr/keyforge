import { Keymap } from '@/components/providers/redux';
import { useSortable } from '@dnd-kit/sortable';
import { ChangeEvent, ComponentProps, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Tooltip } from '@/components/0_base/tooltips';
import { Button } from '@/components/0_base/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { InputButton } from '@/components/0_base/inputButton';
import { mergeProps } from 'react-aria';

export const LayerItem = ({
  layer,
  active,
  onDelete,
  onDuplicateLayer,
  onNameChange,
  ...props
}: {
  layer: Keymap['layers'][number];
  active?: boolean;
  isDragged?: boolean;
  onNameChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete?: () => void;
  onDuplicateLayer?: () => void;
} & Omit<ComponentProps<'div'>, 'ref'>) => {
  const [edit, setEdit] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id, disabled: edit });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Tooltip
      ref={setNodeRef}
      delay={0}
      isDisabled={isDragging || !onDelete}
      placement="right"
      {...listeners}
      {...attributes}
      tooltip={
        <div className="flex space-x-1">
          <Button
            className="px-[6px] text-[10px] bg-mainbg"
            onPress={() => {
              onDuplicateLayer?.();
            }}
          >
            <FontAwesomeIcon icon={faCopy} />
          </Button>
          <Button
            onPress={() => {
              onDelete?.();
            }}
            className="px-[6px] text-[10px] bg-mainbg"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      }
    >
      <InputButton
        value={layer.name}
        style={style}
        colorScheme="default-filled"
        edit={edit}
        placeholder="<unamed-layer>"
        active={active}
        onChange={onNameChange}
        onVisibilityChange={(e) => {
          if (!e) {
            setEdit(false);
          }
        }}
        {...mergeProps(props)}
      />
    </Tooltip>
  );
};

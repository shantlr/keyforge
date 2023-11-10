import { MutableRefObject, useRef } from 'react';
import type { AriaListBoxProps } from 'react-aria';
import { mergeProps, useFocusRing, useListBox, useOption } from 'react-aria';
import { ListState, Node } from 'react-stately';

export function ListBox<T extends object>({
  state,
  listBoxRef,
  ...props
}: Omit<AriaListBoxProps<T>, 'children'> & {
  state: ListState<T>;
  listBoxRef?: MutableRefObject<HTMLUListElement | null>;
}) {
  // Get props for the listbox element
  let ref = useRef<HTMLUListElement | null>(null);
  let { listBoxProps, labelProps } = useListBox(props, state, ref);

  if (typeof listBoxRef === 'object') {
    listBoxRef.current = ref.current;
  }

  return (
    <>
      <div {...labelProps}>{props.label}</div>
      <ul
        {...listBoxProps}
        ref={ref}
        className="overflow-auto max-h-[600px] z-[100]"
      >
        {[...state.collection].map((item) =>
          item.type === 'section' ? null : (
            // <ListBoxSection key={item.key} section={item} state={state} />
            <Option key={item.key} item={item} state={state} />
          )
        )}
      </ul>
    </>
  );
}

function Option<T extends object>({
  item,
  state,
}: {
  item: Node<T>;
  state: ListState<T>;
}) {
  // Get props for the option element
  const ref = useRef(null);
  const { optionProps, isSelected, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  console.log('OPT', item);

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      className="hover:bg-primary px-2 rounded-sm cursor-pointer outline-none active:bg-primary-darker transition select-none"
    >
      {item.rendered}
    </li>
  );
}

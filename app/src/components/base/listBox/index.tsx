import type { AriaListBoxProps } from 'react-aria';
import { ListState, Node } from 'react-stately';
import { mergeProps, useFocusRing, useListBox, useOption } from 'react-aria';
import { useRef } from 'react';

export function ListBox<T extends object>({
  state,
  ...props
}: Omit<AriaListBoxProps<T>, 'children'> & {
  state: ListState<T>;
}) {
  // // Create state based on the incoming props
  // let state = useListState(props);

  // Get props for the listbox element
  let ref = useRef(null);
  let { listBoxProps, labelProps } = useListBox(props, state, ref);

  return (
    <>
      <div {...labelProps}>{props.label}</div>
      <ul {...listBoxProps} ref={ref} className="overflow-auto max-h-[600px]">
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

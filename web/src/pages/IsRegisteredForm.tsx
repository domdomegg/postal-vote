import {
  Button, Fieldset, MultiChoice, Radio,
} from 'govuk-react';
import { SubmitHandler, useForm } from 'react-hook-form';

const IsRegisteredForm = ({ onRegistered, onNotRegistered }: { onRegistered: () => void, onNotRegistered: () => void }) => {
  type TFieldValues = {
    isRegistered: 'yes' | 'no'
  };

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount, isSubmitting },
  } = useForm<TFieldValues>({
    reValidateMode: 'onSubmit',
  });

  const validateAnswered = (value?: string): string | undefined => (value?.length ? undefined : 'Please select an option');

  const onSubmit: SubmitHandler<TFieldValues> = ({ isRegistered }) => {
    if (isRegistered === 'yes') return onRegistered();
    if (isRegistered === 'no') return onNotRegistered();
    throw new Error(`Invalid value for isRegistered field: ${isRegistered}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          size="XLARGE"
          mb={4}
        >
          Are you registered to vote?
        </Fieldset.Legend>
        <MultiChoice
          mb={6}
          label=""
          meta={{ error: errors?.isRegistered?.message, touched: submitCount > 0 }}
        >
          <Radio
            type="radio"
            value="yes"
            {...register('isRegistered', { validate: validateAnswered })}
          >
            Yes
          </Radio>
          <Radio
            type="radio"
            value="no"
            {...register('isRegistered', { validate: validateAnswered })}
          >
            No
          </Radio>
          <Radio
            type="radio"
            value="no"
            {...register('isRegistered', { validate: validateAnswered })}
          >
            I'm not sure
          </Radio>
        </MultiChoice>

        <Button type="submit" disabled={isSubmitting}>
          Continue
        </Button>
      </Fieldset>
    </form>
  );
};

export default IsRegisteredForm;

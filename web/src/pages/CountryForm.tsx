import {
  Button, Fieldset, MultiChoice, Radio,
} from 'govuk-react';
import { SubmitHandler, useForm } from 'react-hook-form';

const CountryForm = ({ onNonNI, onNI }: { onNonNI: () => void, onNI: () => void }) => {
  type TFieldValues = {
    country: 'England' | 'Scotland' | 'Wales' | 'Northern Ireland'
  };

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount, isSubmitting },
  } = useForm<TFieldValues>({
    reValidateMode: 'onSubmit',
  });

  const validateAnswered = (value?: string): string | undefined => (value?.length ? undefined : 'Please select an option');

  const onSubmit: SubmitHandler<TFieldValues> = ({ country }) => {
    if (country === 'Northern Ireland') return onNI();
    return onNonNI();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          size="XLARGE"
          mb={4}
        >
          Where are you registered to vote?
        </Fieldset.Legend>
        <MultiChoice
          mb={6}
          label=""
          meta={{ error: errors?.country?.message, touched: submitCount > 0 }}
        >
          <Radio
            type="radio"
            value="England"
            {...register('country', { validate: validateAnswered })}
          >
            England
          </Radio>
          <Radio
            type="radio"
            value="Scotland"
            {...register('country', { validate: validateAnswered })}
          >
            Scotland
          </Radio>
          <Radio
            type="radio"
            value="Wales"
            {...register('country', { validate: validateAnswered })}
          >
            Wales
          </Radio>
          <Radio
            type="radio"
            value="Northern Ireland"
            {...register('country', { validate: validateAnswered })}
          >
            Northern Ireland
          </Radio>
        </MultiChoice>

        <Button type="submit" disabled={isSubmitting}>
          Continue
        </Button>
      </Fieldset>
    </form>
  );
};

export default CountryForm;

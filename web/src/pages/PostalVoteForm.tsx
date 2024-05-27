import React, { useEffect } from 'react';
import {
  Button, Checkbox, Details, ErrorText, Fieldset, FormGroup, Heading, HintText, InputField, LabelText, Link, Panel, Paragraph, Select,
} from 'govuk-react';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import SignaturePadLib from 'signature_pad';
import { Route, Routes, useNavigate } from 'react-router-dom';
import RHFDateField from '../components/rhfDateField';
import env from '../env/env';

type TFieldValues = {
  firstName: string,
  lastName: string,
  dob: { day?: string, month?: string, year?: string },
  email: string,
  phone: string,
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  addressPostcode: string,
  useAlternativeAddress: boolean,
  alternativeAddressLine1: string,
  alternativeAddressLine2: string,
  alternativeAddressLine3: string,
  alternativeAddressPostcode: string,
  alternativeAddressReason: string,
  alternativeAddressReasonOther: string,
  signatureProvided: boolean,
  signatureDataUri: string,
};

interface Request {
  firstName: string,
  lastName: string,
  dob: string,
  email: string,
  phone?: string,
  addressLine1: string,
  addressLine2?: string,
  addressLine3?: string,
  addressPostcode: string,
  alternativeAddressLine1?: string,
  alternativeAddressLine2?: string,
  alternativeAddressLine3?: string,
  alternativeAddressPostcode?: string,
  alternativeAddressReason?: string,
  signatureDataUri: string,
  date: string,
  recaptchaToken?: string,
}

const PAGE_1_FIELDS = ['firstName', 'lastName', 'dob', 'email', 'phone', 'addressLine1', 'addressLine2', 'addressLine3', 'addressPostcode', 'useAlternativeAddress', 'alternativeAddressLine1', 'alternativeAddressLine2', 'alternativeAddressLine3', 'alternativeAddressPostcode', 'alternativeAddressReason', 'alternativeAddressReasonOther'] as const;

const postcodeRegex = /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]?[0-9][ABD-HJLN-UW-Z]{2}|GIR0AA)$/i;
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const PostalVoteForm = () => {
  const form = useForm<TFieldValues>({ reValidateMode: 'onSubmit' });
  const navigate = useNavigate();

  const [councilName, setCouncilName] = React.useState<string | null>(null);
  const [pdf, setPdf] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<TFieldValues> = async (data) => {
    const dob = String(Number(data.dob.day)).padStart(2, '0') + String(Number(data.dob.month)).padStart(2, '0') + String(Number(data.dob.year));
    const date = String(new Date().getDate()).padStart(2, '0') + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getFullYear());

    const request: Request = {
      firstName: data.firstName,
      lastName: data.lastName,
      dob,
      email: data.email,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      addressLine3: data.addressLine3,
      addressPostcode: data.addressPostcode.replace(/\s/g, '').toUpperCase(),
      ...data.useAlternativeAddress ? {
        alternativeAddressLine1: data.alternativeAddressLine1,
        alternativeAddressLine2: data.alternativeAddressLine2,
        alternativeAddressLine3: data.alternativeAddressLine3,
        alternativeAddressPostcode: data.alternativeAddressPostcode.replace(/\s/g, '').toUpperCase(),
        alternativeAddressReason: data.alternativeAddressReason === 'Other' ? data.alternativeAddressReasonOther : data.alternativeAddressReason,
      } : {},
      signatureDataUri: data.signatureDataUri,
      date,
      recaptchaToken: await getRecaptchaToken(),
    };

    const submitResponse = await fetch(`${env.API_BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    const content: { message: string, councilName?: string, pdf?: string } = await submitResponse.json();

    if (submitResponse.status === 200) {
      if (content.councilName) {
        setCouncilName(content.councilName);
      }
      navigate('/postal-vote-form/success');
    } else if (submitResponse.status === 404 && content.pdf) {
      setPdf(content.pdf);
      navigate('/postal-vote-form/manual');
    } else {
      alert(`Error: status ${submitResponse.status} from API, with body: ${JSON.stringify(content)}.`);
      console.error(submitResponse);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Routes>
        <Route
          path="/your-details"
          element={
            <PostalVoteFormPage1 form={form} />
        }
        />
        <Route
          path="/declaration"
          element={
            <PostalVoteFormPage2 form={form} />
        }
        />
        <Route
          path="/success"
          element={
            <Success councilName={councilName} />
        }
        />
        {pdf && (
        <Route
          path="/manual"
          element={
            <Manual pdf={pdf} postcode={form.watch('addressPostcode')} />
        }
        />
        )}
      </Routes>
    </form>
  );
};

const getRecaptchaToken = (): Promise<string | undefined> => {
  return new Promise((resolve) => {
    if ('grecaptcha' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { grecaptcha } = (window as any);

      grecaptcha.ready(() => {
        grecaptcha.execute(env.RECAPTCHA_V3_SITE_KEY, { action: 'submit' }).then((token: string | null) => {
          resolve(token ?? undefined);
        });
      });
    } else {
      resolve(undefined);
    }
  });
};

const PostalVoteFormPage1 = ({ form }: { form: UseFormReturn<TFieldValues> }) => {
  const navigate = useNavigate();

  const validateFirstName = (value?: string): string | undefined => (value?.length ? undefined : 'Please enter your first name');
  const validateLastName = (value?: string): string | undefined => (value?.length ? undefined : 'Please enter your last name');
  const validateDOB: (value?: {
    year?: number | string;
    month?: number | string;
    day?: number | string;
  }) => string | undefined = (value) => {
    if (value && value.year && value.month && value.day) {
      const year = Number(value.year);
      const month = Number(value.month) - 1;
      const day = Number(value.day);
      const testDate = new Date(year, month, day);
      if (
        // Check date is in the past
        testDate < new Date()
        // Is after 1900
        && testDate.getFullYear() > 1900
        // and a real date resolves to the inputted date (e.g. month is not 13, not 29th February on a non leap year)
        && testDate.getFullYear() === year
        && testDate.getMonth() === month
        && testDate.getDate() === day
      ) {
        return undefined;
      }
      return 'Please enter a valid date';
    }
    return 'Please enter your date of birth';
  };
  const validateAddressLine1 = (value?: string): string | undefined => (value?.length ? undefined : 'Please enter your address');
  const validatePostcode = (value?: string): string | undefined => {
    if (value === undefined || value.length === 0) return 'Please enter your postcode';
    if (!postcodeRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid postcode';
    return undefined;
  };
  const validateEmail = (value?: string): string | undefined => {
    if (value === undefined || value.length === 0) return 'Please enter your email';
    if (!emailRegex.test(value.trim())) return 'Please enter a valid email';
    return undefined;
  };
  const validateAlternativeAddressReasonOther = (value?: string): string | undefined => (value?.length ? undefined : 'Please enter a reason');

  return (
    <Fieldset>
      <Fieldset.Legend size="XLARGE" mb={4}>
        Your details
      </Fieldset.Legend>

      <HintText>Enter your name in full, as it appears on official documents.</HintText>
      <InputField
        mb={4}
        meta={{ error: form.formState.errors.firstName?.message, touched: true }}
        input={{ autoComplete: 'given-name', ...form.register('firstName', { validate: validateFirstName }) }}
      >
        First name
      </InputField>
      <InputField
        mb={4}
        meta={{ error: form.formState.errors.lastName?.message, touched: true }}
        input={{ autoComplete: 'family-name', ...form.register('lastName', { validate: validateLastName }) }}
      >
        Last name
      </InputField>
      <RHFDateField
        mb={8}
        errorText={(form.formState.errors?.dob as undefined | { message: string })?.message}
        input={form.register('dob', { validate: validateDOB })}
      // TODO: autocomplete
      >
        Date of birth
      </RHFDateField>

      <HintText>Providing an email and phone number gives your electoral registration office a way to contact you about your application.</HintText>
      <InputField
        mb={4}
        meta={{ error: form.formState.errors.email?.message, touched: true }}
        input={{ autoComplete: 'email', ...form.register('email', { validate: validateEmail }) }}
      >
        Email address
      </InputField>
      <InputField
        mb={8}
        meta={{ error: form.formState.errors.phone?.message, touched: true }}
        input={{ autoComplete: 'tel', ...form.register('phone') }}
      >
        Phone number (optional)
      </InputField>

      <HintText>Enter the address where you are registered to vote.</HintText>
      <InputField
        mb={4}
        meta={{ error: form.formState.errors.addressLine1?.message, touched: true }}
        input={{ autoComplete: 'address-line1', ...form.register('addressLine1', { validate: validateAddressLine1 }) }}
      >
        Address line 1
      </InputField>
      <InputField
        mb={4}
        meta={{ error: form.formState.errors.addressLine2?.message, touched: true }}
        input={{ autoComplete: 'address-line2', ...form.register('addressLine2') }}
      >
        Address line 2 (optional)
      </InputField>
      <InputField
        mb={4}
        meta={{ error: form.formState.errors.addressLine3?.message, touched: true }}
        input={{ autoComplete: 'address-level2', ...form.register('addressLine3') }}
        style={{ width: 'calc(max(66%, 16rem))' }}
      >
        Town or city (optional)
      </InputField>
      <InputField
        mb={4}
        meta={{ error: form.formState.errors.addressPostcode?.message, touched: true }}
        input={{ autoComplete: 'postal-code', ...form.register('addressPostcode', { validate: validatePostcode }) }}
        style={{ width: '16rem' }}
      >
        Postcode
      </InputField>

      <Checkbox
        type="checkbox"
        {...form.register('useAlternativeAddress')}
      >
        Send my ballot paper to a different address
      </Checkbox>

      {form.watch('useAlternativeAddress', false) && (
      <>
        <HintText margin={{ direction: 'top', size: 4 }}>Enter the address where you want your ballot paper sent.</HintText>
        <InputField
          mb={4}
          meta={{ error: form.formState.errors.alternativeAddressLine1?.message, touched: true }}
          input={{
            autoComplete: 'address-line1',
            ...form.register('alternativeAddressLine1', {
              validate: (s) => {
                if (form.watch('useAlternativeAddress', false)) return validateAddressLine1(s);
                return undefined;
              },
            }),
          }}
        >
          Address line 1
        </InputField>
        <InputField
          mb={4}
          meta={{ error: form.formState.errors.alternativeAddressLine2?.message, touched: true }}
          input={{ autoComplete: 'address-line2', ...form.register('alternativeAddressLine2') }}
        >
          Address line 2 (optional)
        </InputField>
        <InputField
          mb={4}
          meta={{ error: form.formState.errors.alternativeAddressLine3?.message, touched: true }}
          input={{ autoComplete: 'address-level2', ...form.register('alternativeAddressLine3') }}
          style={{ width: 'calc(max(66%, 16rem))' }}
        >
          Town or city (optional)
        </InputField>
        <InputField
          mb={4}
          meta={{ error: form.formState.errors.alternativeAddressPostcode?.message, touched: true }}
          input={{
            autoComplete: 'postal-code',
            ...form.register('alternativeAddressPostcode', {
              validate: (s) => {
                if (form.watch('useAlternativeAddress', false)) return validatePostcode(s);
                return undefined;
              },
            }),
          }}
          style={{ width: '16rem' }}
        >
          Postcode
        </InputField>

        <Select
          mb={4}
          label="Why would you like your ballot paper sent to this address?"
          input={form.register('alternativeAddressReason')}
          meta={{ error: form.formState.errors.alternativeAddressReason?.message, touched: true }}
        >
          <option value="Working away from home">Working away from home</option>
          <option value="Studying away from home">Studying away from home</option>
          <option value="Living away from home">Living away from home</option>
          <option value="On holiday">On holiday</option>
          <option value="Other">Other</option>
        </Select>

        {form.watch('alternativeAddressReason', '') === 'Other' && (
        <InputField
          mb={4}
          meta={{ error: form.formState.errors.alternativeAddressReasonOther?.message, touched: true }}
          input={form.register('alternativeAddressReasonOther', {
            validate: (s) => {
              if (form.watch('useAlternativeAddress', false) && form.watch('alternativeAddressReason', '') === 'Other') return validateAlternativeAddressReasonOther(s);
              return undefined;
            },
          })}
        >
          Your other reason
        </InputField>
        )}
      </>
      )}

      <Button
        margin={{ direction: 'top', size: 4 }}
        disabled={form.formState.isSubmitting}
        onClick={async (e) => {
          e.preventDefault();
          const valid = await form.trigger(PAGE_1_FIELDS);
          if (valid) {
            navigate('/postal-vote-form/declaration');
          }
        }}
      >
        Continue
      </Button>
    </Fieldset>
  );
};

const PostalVoteFormPage2 = ({ form }: { form: UseFormReturn<TFieldValues> }) => {
  const navigate = useNavigate();
  const [pad, setPad] = React.useState<SignaturePadLib | null>(null);

  // Check we haven't jumped into the middle of the flow
  useEffect(() => {
    // By this point we should have a first name
    // If we don't, it probably means we jumped into the middle of the flow
    if (form.watch('firstName') === undefined) {
      console.error('User appears to have started mid-flow... redirecting to earlier in flow');
      navigate('/postal-vote-form/your-details');
    }
  }, [form, navigate]);

  // Register virtual form fields
  useEffect(() => {
    form.register('signatureProvided', {
      validate: (value) => {
        if (!value) {
          if (navigator.maxTouchPoints > 0) return 'Please provide your signature';
          return 'Please provide your signature. Hold down your left mouse button while moving your mouse in the box below to draw your signature.';
        }
        return undefined;
      },
    });
  }, [form]);

  return (
    <Fieldset>
      <Fieldset.Legend size="XLARGE" mb={4}>
        Declaration
      </Fieldset.Legend>
      <HintText>Declaration: As far as I know, the details on this form are true and accurate.</HintText>
      <HintText mb={6}>I understand that to provide false information on this form is an offence, punishable on conviction by imprisonment of up to two years and/or a fine.</HintText>

      <SignaturePad
        meta={{ error: form.formState.errors.signatureProvided?.message }}
        onLoad={setPad}
        onTouchedChanged={(touched) => form.setValue('signatureProvided', touched)}
      />

      <Details summary="I can't provide a signature">
        <p>If you can't provide a signature or consistent signature due to a disability or inability to read or write, you should <Link href={`https://www.gov.uk/contact-electoral-registration-office?postcode=${encodeURIComponent(form.watch('addressPostcode'))}`} target="_blank" rel="noreferrer">contact your local electoral registration office</Link>.</p>

        <p>The Electoral Commision website has <Link href="https://www.electoralcommission.org.uk/running-electoral-registration-wales/absent-voting/postal-voting/signature-waivers-postal-vote-applications" target="_blank" rel="noreferrer">additional guidance about signature waivers for postal votes</Link>.</p>
      </Details>

      <Button
        margin={{ direction: 'top', size: 4 }}
        disabled={form.formState.isSubmitting}
        type="submit"
        onClick={() => {
          // we do this on submit rather than update for performance
          if (pad) {
            form.setValue('signatureDataUri', pad.toDataURL('image/png'));
          }

          // default action will then run after this and trigger submit of form
        }}
        mb={2}
      >
        Submit
      </Button>

      <HintText style={{ fontSize: '75%' }}>This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms of Service</a> apply.</HintText>
    </Fieldset>
  );
};

const Success = ({ councilName }: { councilName: string | null }) => {
  return (
    <>
      <Panel title="Application complete" />
      <Paragraph mb={8}>We have sent you a confirmation email.</Paragraph>
      <Heading size="LARGE">What happens next</Heading>
      <Paragraph>{`We’ve sent your application to ${councilName ?? 'your local'} electoral register office.`}</Paragraph>
      <Paragraph>They will contact you either to confirm your postal vote, or to ask for more information.</Paragraph>
    </>
  );
};

const Manual = ({ pdf, postcode }: { pdf: string, postcode: string }) => {
  const navigate = useNavigate();

  // Check we haven't jumped into the middle of the flow
  useEffect(() => {
    // By this point we should have a pdf and postcode
    // If we don't, it probably means we jumped into the middle of the flow
    if (!pdf || !postcode) {
      console.error('User appears to have started mid-flow... redirecting to earlier in flow');
      navigate('/postal-vote-form/your-details');
    }
  }, [pdf, postcode, navigate]);

  return (
    <>
      <Heading size="XLARGE">Sending your form</Heading>
      <Paragraph>We've prepared your postal vote application form. Download it and email or post it to your local electoral registration office.</Paragraph>
      <Paragraph linkRenderer={LinkRenderer}>{`You can find their details on the [GOV.UK website](https://www.gov.uk/contact-electoral-registration-office?postcode=${encodeURIComponent(postcode)}).`}</Paragraph>
      <Paragraph>They will contact you either to confirm your postal vote, or to ask for more information.</Paragraph>
      <Button as="a" download="postal-vote.pdf" href={`data:application/pdf;base64,${pdf}`}>Download form</Button>
    </>
  );
};

const LinkRenderer: React.FC<React.PropsWithChildren<{ href: string }>> = ({ href, children }) => <a href={href} target="_blank" rel="noreferrer">{children}</a>;

const SignaturePad = ({ onLoad, meta, onTouchedChanged }: { onLoad: (s: SignaturePadLib) => void, meta: { error?: string }, onTouchedChanged: (touched: boolean) => void }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [pad, setPad] = React.useState<SignaturePadLib | null>(null);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (canvasRef.current != null) {
      const canvas = canvasRef.current;
      const s = new SignaturePadLib(canvas, { minDistance: 1 });
      s.on();
      setPad(s);

      return () => s.off();
    }
    return undefined;
  }, []);

  React.useEffect(() => {
    if (pad && canvasRef.current) {
      const canvas = canvasRef.current;

      onLoad(pad);

      const onBeginStroke = () => {
        setTouched(true);
        onTouchedChanged(true);
      };
      pad.addEventListener('beginStroke', onBeginStroke);

      const resizeCanvas = () => {
        // Canvas not actually changing size
        if (canvas.width === canvas.offsetWidth) {
          return;
        }

        // This part causes the canvas to be cleared
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetWidth / 3.24324324;
        canvas.getContext('2d')?.scale(1, 1);

        // Resizing the canvas clears it. To make the state of the SignaturePadLib
        // consistent with the canvas, we clear it manually.
        pad.clear();
        setTouched(false);
        onTouchedChanged(false);
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      return () => {
        pad.removeEventListener('beginStroke', onBeginStroke);
        window.removeEventListener('resize', resizeCanvas);
      };
    }
    return undefined;
  }, [pad, onLoad, onTouchedChanged]);

  return (
    <div>
      <FormGroup error={!!meta.error}>
        <LabelText>
          Signature
        </LabelText>
        <HintText>
          {navigator.maxTouchPoints > 0 ? 'Touch' : 'Click in'} and draw your signature in the box below
        </HintText>
        {meta.error && <ErrorText>{meta.error}</ErrorText>}
        <div style={{
          border: '1rem solid #ccc',
          // The FormGroup error makes the div 20px narrower. To prevent this changing the width of the
          // signature box (and therefore us needing to recalculate and wipe it beacuse of the resize)
          // we alternately toggle some extra margin on the right, so the signature box stays constant size
          marginRight: meta.error ? '0' : '20px',
        }}
        >
          <div style={{ width: 'calc(100%)', aspectRatio: '600 / 185' }}>
            <canvas
              ref={canvasRef}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>
        <Button
          margin={{ direction: 'top', size: 2 }}
          buttonColour="#f3f2f1"
          buttonHoverColour="#dbdad9"
          buttonShadowColour="#929191"
          buttonTextColour="#0b0c0c"
          disabled={!touched}
          onClick={(e) => {
            e.preventDefault();
            if (pad) {
              pad.clear();
            }
            setTouched(false);
            onTouchedChanged(false);
          }}
        >
          Clear signature
        </Button>
      </FormGroup>
    </div>
  );
};

export default PostalVoteForm;

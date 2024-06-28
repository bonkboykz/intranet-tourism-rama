import { useEffect } from 'react';
import Switch from 'react-switch';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <form onSubmit={submit} className="w-full p-4 sm:p -6 sm:py-8 ">
                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <div className="mb-2.5">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={data.email}
                        className="mt-1 block w-full px-3.5 py-2 whitespace-nowrap rounded-lg border-2 border-solid border-neutral-200 shadow-none focus:outline-none focus:border-2 focus:border-blue-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                </div>

                <div className="mb-2.5">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={data.password}
                        className="mt-1 block w-full px-3.5 py-2 whitespace-nowrap rounded-lg border-2 border-solid border-neutral-200 shadow-none focus:outline-none focus:border-2 focus:border-blue-500"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                </div>

                <div className="mt-4 flex items-center mb-2.5">
                    <Switch
                        checked={data.remember}
                        onChange={(checked) => setData('remember', checked)}
                        onColor="#36c"
                        onHandleColor="#fff"
                        handleDiameter={24}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={16}
                        width={40}
                        className="react-switch"
                    />
                    <span className="ml-2 text-sm text-neutral-500">Remember me?</span>
                </div>

                <PrimaryButton className="flex justify-center w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50" disabled={processing}>
                    Log in
                </PrimaryButton>
                <div className="block w-full text-center text-gray-700 text-sm py-2">OR</div>

                <a type="button"
                    className={
                        `inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                            processing && 'opacity-25'
                        } flex justify-center w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50`
                    }
                    disabled={processing}
                    href="/auth/azure/redirect">
                    Log in Using AD
                </a>
                <div className="mt-2 h-1">
                 <InputError message={
                    errors.email ? "Email and/or password is wrong" :
                    errors.password ? "Email and/or password is wrong" :
                    ""}
                    className="text-sm text-red-500" />
                </div>
            </form>
        </GuestLayout>
    );
}

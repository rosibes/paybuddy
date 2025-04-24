interface inputProps {
    reference?: any,
    placeholder: string,
    className?: string,
    label?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string

}
export function Input({ placeholder, className, label, reference, onChange, type = "text" }: inputProps) {
    return <div className="text-sm font-medium text-left py-2">
        {label}
        <input onChange={onChange}
            ref={reference}
            placeholder={placeholder}
            className={`px-4 py-2 border rounded w-full ${className || ''}`}
            type={type}
        />
    </div >
}
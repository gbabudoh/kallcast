import CreateSlotForm from '@/components/coach/CreateSlotForm';

export default function CreateSlotPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Session</h1>
        <p className="text-gray-600 mt-2">
          Set up a new coaching session that learners can book
        </p>
      </div>
      <CreateSlotForm />
    </div>
  );
}

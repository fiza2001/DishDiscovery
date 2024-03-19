'use client'
import { createClient } from 'contentful-management';
import { useState } from 'react';

const UpdateButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

  const client = createClient({
  accessToken: 'CFPAT-DngYl9OCOyzx63dS07aiFrRegT5DcJhUjjjl4dU5eiE',
});

    try {
      const space = await client.getSpace('8fhkkx1egwnn');
      const environment = await space.getEnvironment('master');
      const entry = await environment.getEntry('7xWPYli0DUtXCKzT9tJhiL');

      entry.fields.title['en-US'] = 'Dum Biryanii';
      await entry.update();

      alert(`Entry ${entry.sys.id} updated.`);
    } catch (error) {
      console.error('Error updating entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Updating...' : 'Update Entry'}
    </button>
  );
};

export default UpdateButton;

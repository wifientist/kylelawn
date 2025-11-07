import ReactCompareImage from 'react-compare-image'

interface ImageCompareProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export default function ImageCompare({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After'
}: ImageCompareProps) {
  return (
    <div className="my-8">
      <div className="mb-4 flex justify-between text-sm font-medium text-gray-600">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <ReactCompareImage
          leftImage={beforeImage}
          rightImage={afterImage}
          sliderLineColor="#4CAF50"
          sliderLineWidth={3}
          handleSize={40}
        />
      </div>
    </div>
  )
}
